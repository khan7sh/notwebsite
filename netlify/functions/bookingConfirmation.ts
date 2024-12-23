import { Handler } from '@netlify/functions';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, query, orderByChild, startAt, endAt, get, push } from 'firebase/database';
import nodemailer from 'nodemailer';

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

// Initialize Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const handler: Handler = async (event) => {
  console.log('Received booking request');
  
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) 
    };
  }

  try {
    const bookingData = JSON.parse(event.body || '{}');
    console.log('Parsed booking data:', bookingData);
    
    const { date, timeSlot, guests, name, email, phone, specialRequests } = bookingData;

    // Validate required fields
    if (!date || !timeSlot || !guests || !name || !email || !phone) {
      console.log('Missing required fields:', { date, timeSlot, guests, name, email, phone });
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: 'Missing required fields',
          missingFields: {
            date: !date,
            timeSlot: !timeSlot,
            guests: !guests,
            name: !name,
            email: !email,
            phone: !phone
          }
        }),
      };
    }

    // Parse and validate date
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      console.log('Invalid date format:', date);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Invalid date format' }),
      };
    }

    const startOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate()));
    const endOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 23, 59, 59, 999));

    // Get existing bookings for the selected date
    console.log('Fetching existing bookings for date range:', startOfDay.toISOString(), 'to', endOfDay.toISOString());
    
    const bookingsRef = ref(database, 'bookings');
    const bookingsQuery = query(
      bookingsRef,
      orderByChild('date'),
      startAt(startOfDay.toISOString()),
      endAt(endOfDay.toISOString())
    );

    const snapshot = await get(bookingsQuery);
    const existingBookings: any[] = [];
    snapshot.forEach((childSnapshot) => {
      const booking = childSnapshot.val();
      if (booking && booking.date) {
        existingBookings.push(booking);
      }
    });

    console.log('Found existing bookings:', existingBookings);

    // Calculate remaining capacity for the selected time slot
    const [selectedStartTime] = timeSlot.split('-');
    console.log('Selected start time:', selectedStartTime);
    
    // Validate time slot format
    if (!selectedStartTime || !selectedStartTime.match(/^\d{2}:\d{2}$/)) {
      console.log('Invalid time slot format:', timeSlot);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Invalid time slot format' }),
      };
    }

    let remainingCapacity = 40; // Default capacity
    
    existingBookings.forEach(booking => {
      if (booking.timeSlot && booking.timeSlot.split('-')[0] === selectedStartTime) {
        remainingCapacity -= booking.guests;
      }
    });

    console.log('Remaining capacity:', remainingCapacity);

    // Check if there's enough capacity for the new booking
    if (remainingCapacity < guests) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: `Sorry, there are only ${remainingCapacity} seats available for this time slot` 
        }),
      };
    }

    // Save the booking
    const newBooking = {
      date: startOfDay.toISOString(),
      timeSlot,
      guests,
      name,
      email,
      phone,
      specialRequests,
      createdAt: new Date().toISOString(),
    };

    console.log('Saving new booking:', newBooking);
    const newBookingRef = await push(bookingsRef, newBooking);
    console.log('Booking saved with ID:', newBookingRef.key);

    // Prepare and send confirmation emails
    try {
      const customerEmail = {
        from: '"Noshe Cambridge" <noshecambridge@gmail.com>',
        to: email,
        subject: 'Booking Confirmation - Noshe Cambridge',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5EBE0; color: #333;">
            <h1 style="color: #8B2635; text-align: center;">Booking Confirmation</h1>
            <p>Dear ${name},</p>
            <p>Thank you for booking with Noshe Cambridge. Your reservation details are:</p>
            <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Time:</strong> ${timeSlot}</p>
              <p><strong>Number of guests:</strong> ${guests}</p>
              ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
            </div>
            <p>We look forward to welcoming you to Noshe Cambridge!</p>
            <p style="font-size: 0.9em; color: #666;">If you need to modify or cancel your booking, please call us at 07964 624055.</p>
          </div>
        `,
      };

      const managerEmail = {
        from: '"Noshe Cambridge Bookings" <noshecambridge@gmail.com>',
        to: 'noshecambridge@gmail.com',
        subject: 'New Booking - Noshe Cambridge',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5EBE0; color: #333;">
            <h1 style="color: #8B2635; text-align: center;">New Booking Alert</h1>
            <p>A new booking has been made at Noshe Cambridge:</p>
            <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #4A5D23; margin-top: 0;">Booking Details:</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Time:</strong> ${timeSlot}</p>
              <p><strong>Number of guests:</strong> ${guests}</p>
              ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
              <p><strong>Remaining Capacity:</strong> ${remainingCapacity - guests} seats</p>
            </div>
            <p>Please ensure the table is prepared accordingly.</p>
          </div>
        `,
      };

      console.log('Sending confirmation emails');
      await Promise.all([
        transporter.sendMail(customerEmail),
        transporter.sendMail(managerEmail),
      ]);
      console.log('Confirmation emails sent successfully');

    } catch (emailError) {
      console.error('Error sending confirmation emails:', emailError);
      // Continue execution even if emails fail
      // We might want to implement a retry mechanism or queue system in the future
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Booking confirmed successfully! Check your email for confirmation details.',
        bookingId: newBookingRef.key,
      }),
    };
  } catch (error) {
    console.error('Error processing booking:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'There was an error processing your booking. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

export { handler };
