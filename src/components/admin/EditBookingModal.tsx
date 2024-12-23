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
  { start: '09:00', end: '10:45' },
  { start: '10:45', end: '12:30' },
  { start: '12:30', end: '14:15' },
  { start: '14:15', end: '16:00' },
  { start: '16:00', end: '17:45' },
  { start: '17:45', end: '19:30' },
  { start: '19:30', end: '21:15' },
  { start: '21:15', end: '23:00' },
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
        const slotHour = parseInt(slot.start.split(':')[0]);
        const slotMinute = parseInt(slot.start.split(':')[1]);
        const slotTotalMinutes = slotHour * 60 + slotMinute;

        if (Math.abs(bookingTotalMinutes - slotTotalMinutes) <= 45) {
          return `${slot.start}-${slot.end}`;
        }
      }
    }
    return `${TIME_SLOTS[0].start}-${TIME_SLOTS[0].end}`;
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Time Slot</label>
            <select
              name="timeSlot"
              value={getCurrentTimeSlot()}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={`${slot.start}-${slot.end}`} value={`${slot.start}-${slot.end}`}>
                  {slot.start} - {slot.end}
                </option>
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

