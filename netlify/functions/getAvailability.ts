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
  { start: '10:45', end: '12:30', capacity: 40, status: 'available' },
  { start: '12:30', end: '14:15', capacity: 40, status: 'available' },
  { start: '14:15', end: '16:00', capacity: 40, status: 'available' },
  { start: '16:00', end: '17:45', capacity: 40, status: 'available' },
  { start: '17:45', end: '19:30', capacity: 40, status: 'available' },
  { start: '19:30', end: '21:15', capacity: 40, status: 'available' },
  { start: '21:15', end: '23:00', capacity: 40, status: 'available' },
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
    const selectedDate = new Date(date);
    const startOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate()));
    const endOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 23, 59, 59, 999));

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

    // Calculate remaining capacity for each time slot
    const timeSlots = DEFAULT_TIME_SLOTS.map(slot => ({ ...slot }));
    
    bookings.forEach(booking => {
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
      },
      body: JSON.stringify({ 
        success: true, 
        timeSlots,
        date: startOfDay.toISOString()
      }),
    };
  } catch (error) {
    console.error('Error fetching availability:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch availability',
        timeSlots: DEFAULT_TIME_SLOTS 
      }),
    };
  }
};

export { handler }; 