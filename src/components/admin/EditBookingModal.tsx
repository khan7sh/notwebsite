import React, { useState, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Booking {
  id: string;
  date: Date;
  timeSlot?: string;
  time?: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

interface EditBookingModalProps {
  booking: Booking;
  onClose: () => void;
  onSave: (updatedBooking: Booking) => void;
}

const TIME_SLOTS = [
  '09:00-10:45', '09:30-11:15', '10:00-11:45', '10:30-12:15',
  '11:00-12:45', '11:30-13:15', '12:00-13:45', '12:30-14:15',
  '13:00-14:45', '13:30-15:15', '14:00-15:45', '14:30-16:15',
  '15:00-16:45', '15:30-17:15', '16:00-17:45', '16:30-18:15',
  '17:00-18:45', '17:30-19:15', '18:00-19:45', '18:30-20:15',
  '19:00-20:45', '19:30-21:15', '20:00-21:45', '20:30-22:15',
  '21:00-22:45'
];

const EditBookingModal: React.FC<EditBookingModalProps> = ({ booking, onClose, onSave }) => {
  const [editedBooking, setEditedBooking] = useState<Booking>({
    ...booking,
    date: new Date(booking.date)
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedBooking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setEditedBooking(prev => ({
        ...prev,
        date
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedBooking);
  };

  // Get current time slot or default to first slot
  const getCurrentTimeSlot = () => {
    if (editedBooking.timeSlot) {
      return editedBooking.timeSlot;
    }
    if (editedBooking.time) {
      // Try to match old time format to closest time slot
      const bookingHour = parseInt(editedBooking.time.split(':')[0]);
      const bookingMinute = parseInt(editedBooking.time.split(':')[1]);
      const bookingTotalMinutes = bookingHour * 60 + bookingMinute;

      for (const slot of TIME_SLOTS) {
        const slotHour = parseInt(slot.split(':')[0]);
        const slotMinute = parseInt(slot.split(':')[1]);
        const slotTotalMinutes = slotHour * 60 + slotMinute;

        if (Math.abs(bookingTotalMinutes - slotTotalMinutes) <= 45) {
          return slot;
        }
      }
    }
    return TIME_SLOTS[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-burgundy mb-4">Edit Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={editedBooking.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={editedBooking.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <DatePicker
              selected={editedBooking.date}
              onChange={handleDateChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
            <select
              value={editedBooking.timeSlot}
              onChange={(e) => setEditedBooking({ ...editedBooking, timeSlot: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-burgundy focus:border-burgundy"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
            <select
              name="guests"
              value={editedBooking.guests}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
            >
              {[...Array(40)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} guests</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Special Requests</label>
            <textarea
              name="specialRequests"
              value={editedBooking.specialRequests || ''}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-burgundy text-white rounded-md hover:bg-opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;

