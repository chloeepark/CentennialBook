import React, { useState } from 'react';
import './RSVP.css';

const RSVP = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Going'); // Default RSVP status

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('RSVP Submitted:', { title, description, date, location, status });
    alert('RSVP submitted successfully!');
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setStatus('Going');
  };

  return (
    <div className="rsvp-container">
      <h1 className="rsvp-title">RSVP to Events</h1>
      <form className="rsvp-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the event title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Event Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="date">Event Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Event Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter the event location"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">RSVP Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Going">Going</option>
            <option value="Not Going">Not Going</option>
            <option value="Maybe">Maybe</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Submit RSVP</button>
      </form>
    </div>
  );
};

export default RSVP;
