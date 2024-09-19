import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'; // Ensure moment.js is installed
import axios from 'axios'; // Ensure axios is installed
import Modal from 'react-modal'; // Import react-modal

const localizer = momentLocalizer(moment);

const MyBigCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // Fetch events from an API
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/shifts', { withCredentials: true }); // Replace with your API endpoint
        const fetchedEvents = response.data.map(event => ({
          title: event.shift_name,
          start: new Date(event.time_started),
          end: new Date(event.time_finished),
          hours: event.total_hours,
          pay: event.total_pay,
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  // Inline styles for the modal
  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '50px',
      borderRadius: '10px',
      background: '#fff',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      overflow: 'auto', // Ensure the content scrolls if it overflows
    },
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.7)', // Darker overlay to block background
      zIndex: 1000, // Ensure modal is on top
    },
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectEvent={handleEventClick} // Handle event click
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Event Details"
        style={modalStyles} // Apply inline styles
        ariaHideApp={false} // Only use this if you're not using a root element with id 'root'
      >
        {selectedEvent && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '10px' }}>{selectedEvent.title}</h2>
            <p style={{padding: '5px'}}><strong>Start:</strong> {(new Date(selectedEvent.start).toLocaleString())}</p>
            <p style={{padding: '5px'}}><strong>End:</strong> {(new Date (selectedEvent.end).toLocaleString())}</p>
            <p style={{padding: '5px'}}><strong>Hours:</strong> {(selectedEvent.hours).toFixed(2)}</p>
            <p style={{padding: '5px'}}><strong>Pay:</strong> £{(selectedEvent.pay).toFixed(2)}</p>
            <button
              onClick={closeModal}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyBigCalendar;
