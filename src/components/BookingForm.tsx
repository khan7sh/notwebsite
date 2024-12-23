import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

interface TimeSlot {
  start: string;
  end: string;
  capacity: number;
  status: 'available' | 'limited' | 'unavailable';
}

interface BookingFormData {
  date: string;
  timeSlot: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
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

const BookingForm: React.FC = () => {
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<BookingFormData>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'confirming' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>(DEFAULT_TIME_SLOTS);

  const selectedGuests = watch('guests');

  // Fetch available time slots whenever date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.post('/.netlify/functions/getAvailability', {
          date: selectedDate.toISOString()
        });
        
        if (response.data && response.data.timeSlots) {
          setAvailableTimeSlots(response.data.timeSlots);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        setAvailableTimeSlots(DEFAULT_TIME_SLOTS);
      }
    };

    fetchAvailability();
  }, [selectedDate]);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setBookingStatus('confirming');
    setSubmitMessage('');
    
    try {
      // Validate time slot format
      if (!data.timeSlot.match(/^\d{2}:\d{2}-\d{2}:\d{2}$/)) {
        throw new Error('Invalid time slot format');
      }

      // Format the data before sending
      const formattedData = {
        ...data,
        date: selectedDate.toISOString(),
        guests: parseInt(data.guests.toString()),
        timeSlot: data.timeSlot
      };

      console.log('Submitting booking data:', formattedData);
      
      const response = await axios.post('/.netlify/functions/bookingConfirmation', formattedData, {
        timeout: 10000
      });
      
      if (response.data && response.data.success) {
        setBookingStatus('success');
        setSubmitMessage(response.data.message);
        reset();
        setSelectedDate(new Date());
      } else {
        throw new Error(response.data?.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setBookingStatus('error');
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        setSubmitMessage(errorMessage);
      } else {
        setSubmitMessage(error instanceof Error ? error.message : 'There was an error processing your booking. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 1; // 1 represents Monday
  };

  const getTimeSlotStatus = (slot: TimeSlot) => {
    if (slot.status === 'unavailable') return '(Fully Booked)';
    if (slot.status === 'limited') return '(Limited Seats)';
    return '';
  };

  const getTimeSlotClassName = (slot: TimeSlot) => {
    if (slot.status === 'unavailable' || (selectedGuests && slot.capacity < selectedGuests)) {
      return 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-60';
    }
    if (slot.status === 'limited') {
      return 'text-yellow-800 bg-yellow-50';
    }
    return '';
  };

  if (bookingStatus === 'success') {
    return (
      <div className="booking-form-container text-center py-8">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif font-semibold text-burgundy mb-4">Thank You for Your Booking!</h3>
        <p className="text-gray-600 mb-6">
          Your reservation has been confirmed. We've sent the details to your email.
        </p>
        <p className="text-gray-600 mb-8">
          We look forward to welcoming you to Noshe Cambridge!
        </p>
        <button
          onClick={() => {
            setBookingStatus('idle');
            setSubmitMessage('');
            const formContainer = document.querySelector('.booking-form-container');
            if (formContainer) {
              formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="bg-burgundy text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors"
        >
          Make Another Booking
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="booking-form-container space-y-6">
      <h3 className="text-2xl font-serif font-semibold text-burgundy mb-6">Reserve Your Table</h3>
      
      <div className="mb-4">
        <p className="text-red-600 font-medium">Please note: We are closed on Mondays.</p>
      </div>

      <div className="mb-8">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <Controller
          control={control}
          name="date"
          rules={{ required: "Please select a date" }}
          render={({ field }) => (
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) {
                  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                  setSelectedDate(utcDate);
                  field.onChange(utcDate.toISOString());
                }
              }}
              filterDate={isWeekday}
              inline
              className="w-full"
              calendarClassName="custom-datepicker mx-auto"
            />
          )}
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message as string}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
          <select
            id="guests"
            {...register("guests", { required: "Number of guests is required" })}
            className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            <option value="">Select guests</option>
            {[...Array(40)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
            ))}
          </select>
          {errors.guests && <p className="mt-1 text-sm text-red-600">{errors.guests.message as string}</p>}
        </div>

        <div>
          <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
          <select
            id="timeSlot"
            {...register("timeSlot", { required: "Time slot is required" })}
            className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            <option value="">Select time slot</option>
            {availableTimeSlots.map((slot) => {
              const isDisabled = slot.status === 'unavailable' || Boolean(selectedGuests && slot.capacity < selectedGuests);
              const status = getTimeSlotStatus(slot);
              const className = getTimeSlotClassName(slot);
              return (
                <option 
                  key={`${slot.start}-${slot.end}`}
                  value={`${slot.start}-${slot.end}`}
                  disabled={isDisabled}
                  className={className}
                  style={isDisabled ? { color: '#9CA3AF', backgroundColor: '#F3F4F6' } : undefined}
                >
                  {`${slot.start} - ${slot.end}${status ? ` ${status}` : ''}`}
                </option>
              );
            })}
          </select>
          {errors.timeSlot && <p className="mt-1 text-sm text-red-600">{errors.timeSlot.message as string}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
          className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          {...register("email", { 
            required: "Email is required", 
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } 
          })}
          className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="tel"
          id="phone"
          {...register("phone", { 
            required: "Phone number is required",
            pattern: { value: /^[0-9+\-\s()]+$/, message: "Invalid phone number" }
          })}
          className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message as string}</p>}
      </div>

      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
        <textarea
          id="specialRequests"
          {...register("specialRequests")}
          rows={5}
          className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out h-32"
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-burgundy text-white py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {bookingStatus === 'confirming' ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Confirming Booking...
          </span>
        ) : (
          'Book Table'
        )}
      </button>

      {submitMessage && (
        <div className={`mt-4 p-4 rounded-md ${
          bookingStatus === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          <p className="text-center">{submitMessage}</p>
        </div>
      )}
    </form>
  );
};

export default BookingForm;
