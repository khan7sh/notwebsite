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
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify email configuration on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendEmail = async (mailOptions: any) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

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
    let emailError = null;
    try {
      const customerEmail = {
        from: {
          name: 'Noshe Cambridge',
          address: 'noshecambridge@gmail.com'
        },
        to: email,
        subject: 'Booking Confirmation - Noshe Cambridge',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Booking Confirmation</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #8B2635; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Booking Confirmation</h1>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <p style="margin-bottom: 20px; font-size: 16px;">Dear <strong>${name}</strong>,</p>
                  
                  <p style="margin-bottom: 25px; font-size: 16px;">Thank you for choosing Noshe Cambridge. We're delighted to confirm your reservation.</p>
                  
                  <div style="background-color: #f8f4f4; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                    <h2 style="color: #8B2635; margin-top: 0; margin-bottom: 15px; font-size: 20px;">Reservation Details</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Date:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">
                          ${new Date(date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Time:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">${timeSlot}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Number of Guests:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">${guests}</td>
                      </tr>
                      ${specialRequests ? `
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Special Requests:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">${specialRequests}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </div>
                  
                  <p style="margin-bottom: 25px; font-size: 16px;">We look forward to welcoming you to Noshe Cambridge and serving you our delicious Afghan cuisine.</p>
                  
                  <div style="background-color: #f8f4f4; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
                    <p style="margin: 0; color: #666666; font-size: 14px;">
                      Need to modify or cancel your booking?<br>
                      Please call us at <strong>07964 624055</strong>
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; color: #666666; font-size: 14px;">
                      Noshe Cambridge<br>
                      07964 624055<br>
                      noshecambridge@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        replyTo: 'noshecambridge@gmail.com'
      };

      const managerEmail = {
        from: {
          name: 'Noshe Cambridge Bookings',
          address: 'noshecambridge@gmail.com'
        },
        to: 'noshecambridge@gmail.com',
        subject: 'New Booking - Noshe Cambridge',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Booking Alert</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #8B2635; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">New Booking Alert</h1>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="background-color: #f8f4f4; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                    <h2 style="color: #8B2635; margin-top: 0; margin-bottom: 15px; font-size: 20px;">Booking Details</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Name:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Email:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Phone:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">${phone}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Date:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">
                          ${new Date(date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Time:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">${timeSlot}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Number of Guests:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">${guests}</td>
                      </tr>
                      ${specialRequests ? `
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Special Requests:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right;">${specialRequests}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; color: #666666;">Remaining Capacity:</td>
                        <td style="padding: 8px 0; font-weight: bold; text-align: right; color: ${(remainingCapacity - guests) < 10 ? '#ff4444' : '#4CAF50'};">
                          ${remainingCapacity - guests} seats
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <div style="background-color: #f8f4f4; padding: 15px; border-radius: 6px;">
                    <p style="margin: 0; color: #666666; text-align: center;">
                      Please ensure the table is prepared accordingly
                    </p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        replyTo: email
      };

      console.log('Sending confirmation emails');
      await Promise.all([
        sendEmail(customerEmail),
        sendEmail(managerEmail)
      ]);
      console.log('Confirmation emails sent successfully');

    } catch (error) {
      console.error('Error sending confirmation emails:', error);
      emailError = error;
    }

    // Return success even if email fails, but include email error in response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: emailError 
          ? 'Booking confirmed successfully, but there was an issue sending confirmation emails. Our team will contact you shortly.'
          : 'Booking confirmed successfully! Check your email for confirmation details.',
        bookingId: newBookingRef.key,
        emailError: emailError ? String(emailError) : null
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
