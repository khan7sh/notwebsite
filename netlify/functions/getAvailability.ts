import { Handler } from '@netlify/functions';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, query, orderByChild, startAt, endAt, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  databaseURL: "https://bookings-f964e-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

interface TimeSlot {
  start: string;
  end: string;
  capacity: number;
  status: 'available' | 'limited' | 'unavailable';
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { start: '09:00', end: '10:45', capacity: 40, status: 'available' },
  { start: '09:30', end: '11:15', capacity: 40, status: 'available' },
  { start: '10:00', end: '11:45', capacity: 40, status: 'available' },
  { start: '10:30', end: '12:15', capacity: 40, status: 'available' },
  { start: '11:00', end: '12:45', capacity: 40, status: 'available' },
  { start: '11:30', end: '13:15', capacity: 40, status: 'available' },
  { start: '12:00', end: '13:45', capacity: 40, status: 'available' },
  { start: '12:30', end: '14:15', capacity: 40, status: 'available' },
  { start: '13:00', end: '14:45', capacity: 40, status: 'available' },
  { start: '13:30', end: '15:15', capacity: 40, status: 'available' },
  { start: '14:00', end: '15:45', capacity: 40, status: 'available' },
  { start: '14:30', end: '16:15', capacity: 40, status: 'available' },
  { start: '15:00', end: '16:45', capacity: 40, status: 'available' },
  { start: '15:30', end: '17:15', capacity: 40, status: 'available' },
  { start: '16:00', end: '17:45', capacity: 40, status: 'available' },
  { start: '16:30', end: '18:15', capacity: 40, status: 'available' },
  { start: '17:00', end: '18:45', capacity: 40, status: 'available' },
  { start: '17:30', end: '19:15', capacity: 40, status: 'available' },
  { start: '18:00', end: '19:45', capacity: 40, status: 'available' },
  { start: '18:30', end: '20:15', capacity: 40, status: 'available' },
  { start: '19:00', end: '20:45', capacity: 40, status: 'available' },
  { start: '19:30', end: '21:15', capacity: 40, status: 'available' },
  { start: '20:00', end: '21:45', capacity: 40, status: 'available' },
  { start: '20:30', end: '22:15', capacity: 40, status: 'available' },
  { start: '21:00', end: '22:45', capacity: 40, status: 'available' },
];

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) 
    };
  }

  try {
    const { date } = JSON.parse(event.body || '{}');
    
    if (!date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: 'Date is required',
          timeSlots: DEFAULT_TIME_SLOTS 
        })
      };
    }

    // Parse the date and check if it's December 25th
    const selectedDate = new Date(date);
    const isChristmas = selectedDate.getMonth() === 11 && selectedDate.getDate() === 25;

    // Define Christmas day time slots
    const CHRISTMAS_TIME_SLOTS = [
      { start: '17:00', end: '18:45', capacity: 40, status: 'available' },
      { start: '19:00', end: '20:45', capacity: 40, status: 'available' },
      { start: '21:00', end: '22:45', capacity: 40, status: 'available' }
    ];

    // Use Christmas slots if it's December 25th, otherwise use default slots
    let timeSlots = isChristmas ? CHRISTMAS_TIME_SLOTS : DEFAULT_TIME_SLOTS;

    // Parse the date and create UTC date objects for start and end of day
    const startOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate()));
    const endOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 23, 59, 59, 999));

    console.log('Fetching bookings for date range:', {
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString()
    });

    // Get all bookings for the selected date
    const bookingsRef = ref(database, 'bookings');
    const bookingsQuery = query(
      bookingsRef,
      orderByChild('date'),
      startAt(startOfDay.toISOString()),
      endAt(endOfDay.toISOString())
    );

    const snapshot = await get(bookingsQuery);
    const bookings: any[] = [];
    
    snapshot.forEach((childSnapshot) => {
      const booking = childSnapshot.val();
      if (booking && booking.date) {
        bookings.push(booking);
      }
    });

    console.log('Found bookings:', bookings);

    // Calculate remaining capacity for each time slot
    timeSlots = timeSlots.map(slot => ({ ...slot }));
    
    bookings.forEach(booking => {
      if (!booking.timeSlot) {
        console.warn('Booking missing timeSlot:', booking);
        return;
      }

      const [startTime] = booking.timeSlot.split('-');
      const slotIndex = timeSlots.findIndex(slot => slot.start === startTime);
      
      if (slotIndex !== -1) {
        timeSlots[slotIndex].capacity -= booking.guests;
        
        // Update status based on remaining capacity
        if (timeSlots[slotIndex].capacity <= 0) {
          timeSlots[slotIndex].status = 'unavailable';
          timeSlots[slotIndex].capacity = 0;
        } else if (timeSlots[slotIndex].capacity <= 10) {
          timeSlots[slotIndex].status = 'limited';
        }
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ 
        success: true, 
        timeSlots,
        date: startOfDay.toISOString()
      }),
    };
  } catch (error) {
    console.error('Error in getAvailability:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to fetch availability',
        error: error instanceof Error ? error.message : 'Unknown error',
        timeSlots: DEFAULT_TIME_SLOTS 
      }),
    };
  }
};

export { handler }; 