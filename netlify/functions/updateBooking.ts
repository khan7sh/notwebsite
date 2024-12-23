import { Handler } from '@netlify/functions';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update, query, orderByChild, equalTo } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  databaseURL: "https://bookings-f964e-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const VALID_TIME_SLOTS = [
  '09:00-10:45', '09:30-11:15', '10:00-11:45', '10:30-12:15',
  '11:00-12:45', '11:30-13:15', '12:00-13:45', '12:30-14:15',
  '13:00-14:45', '13:30-15:15', '14:00-15:45', '14:30-16:15',
  '15:00-16:45', '15:30-17:15', '16:00-17:45', '16:30-18:15',
  '17:00-18:45', '17:30-19:15', '18:00-19:45', '18:30-20:15',
  '19:00-20:45', '19:30-21:15', '20:00-21:45', '20:30-22:15',
  '21:00-22:45'
];

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { bookingId, updates } = JSON.parse(event.body || '{}');
    
    if (!bookingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Booking ID is required' })
      };
    }

    // Validate time slot if it's being updated
    if (updates.timeSlot && !VALID_TIME_SLOTS.includes(updates.timeSlot)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid time slot format' })
      };
    }

    // Check capacity for the new time slot
    if (updates.timeSlot || updates.date) {
      const bookingRef = ref(database, `bookings/${bookingId}`);
      const bookingSnapshot = await get(bookingRef);
      const currentBooking = bookingSnapshot.val();

      if (!currentBooking) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Booking not found' })
        };
      }

      const targetDate = updates.date || currentBooking.date;
      const targetTimeSlot = updates.timeSlot || currentBooking.timeSlot;
      const targetGuests = updates.guests || currentBooking.guests;

      // Get all bookings for the target date
      const bookingsRef = ref(database, 'bookings');
      const bookingsQuery = query(
        bookingsRef,
        orderByChild('date'),
        equalTo(targetDate)
      );

      const snapshot = await get(bookingsQuery);
      let totalGuests = 0;

      // Calculate total guests for the target time slot
      snapshot.forEach((childSnapshot) => {
        const booking = childSnapshot.val();
        if (booking.timeSlot === targetTimeSlot && childSnapshot.key !== bookingId) {
          totalGuests += booking.guests;
        }
      });

      // Check if there's enough capacity (40 seats)
      if (totalGuests + targetGuests > 40) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: `Cannot update booking. The selected time slot would exceed capacity. Available seats: ${40 - totalGuests}`
          })
        };
      }
    }

    // Update the booking
    const bookingRef = ref(database, `bookings/${bookingId}`);
    await update(bookingRef, updates);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Booking updated successfully',
        bookingId
      })
    };

  } catch (error) {
    console.error('Error updating booking:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error updating booking',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

export { handler }; 