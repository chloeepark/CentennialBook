import React, { useState } from 'react';
import "./EventFeed.css";

const EventFeed = ({ userRole }) => {
  // Simulated user ID (replace with actual auth system)
  const currentUserId = 1;

  const [searchQuery, setSearchQuery] = useState('');
  const [followedClubs, setFollowedClubs] = useState([
    { id: 1, name: "BJJ Club", isFollowed: true, organizerId: 1 },
    { id: 2, name: "Programming Society", isFollowed: false, organizerId: 2 },
    { id: 3, name: "Business & Entrepreneurship Club", isFollowed: true, organizerId: 1 },
    { id: 4, name: "Photography Club", isFollowed: false, organizerId: 3 },
    { id: 5, name: "International Students Association", isFollowed: false, organizerId: 2 }
  ]);

  const [events, setEvents] = useState([
    {
      id: 1,
      clubId: 1,
      clubName: "BJJ Club",
      organizerId: 1,
      title: "Beginner BJJ Workshop",
      description: "Introduction to basic techniques and fundamentals of BJJ",
      date: "2024-12-01",
      time: "14:00",
      location: "Main Gym"
    },
    {
      id: 2,
      clubId: 1,
      clubName: "BJJ Club",
      organizerId: 1,
      title: "Advanced Training Session",
      description: "Advanced techniques and sparring practice",
      date: "2024-12-15",
      time: "16:00",
      location: "Training Room 2"
    },
    {
      id: 3,
      clubId: 3,
      clubName: "Business & Entrepreneurship Club",
      organizerId: 1,
      title: "Startup Pitch Competition",
      description: "Present your business ideas to potential investors",
      date: "2024-12-10",
      time: "15:00",
      location: "Auditorium"
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    clubId: null
  });

  const handleFollowClub = (clubId) => {
    setFollowedClubs(followedClubs.map(club => 
      club.id === clubId ? { ...club, isFollowed: !club.isFollowed } : club
    ));
  };

  const canManageEvent = (event) => {
    return event.organizerId === currentUserId;
  };

  const handleCreateEvent = (clubId) => {
    setEventFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      clubId: clubId
    });
    setShowCreateModal(true);
  };

  const handleEditEvent = (event) => {
    if (!canManageEvent(event)) return;
    setSelectedEvent(event);
    setEventFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      clubId: event.clubId
    });
    setShowEditModal(true);
  };

  const handleDeleteEvent = (event) => {
    if (!canManageEvent(event)) return;
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const club = followedClubs.find(c => c.id === eventFormData.clubId);
    const newEvent = {
      id: events.length + 1,
      clubId: eventFormData.clubId,
      clubName: club.name,
      organizerId: currentUserId,
      ...eventFormData
    };
    setEvents([...events, newEvent]);
    setShowCreateModal(false);
    setEventFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      clubId: null
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedEvents = events.map(event =>
      event.id === selectedEvent.id
        ? { ...event, ...eventFormData }
        : event
    );
    setEvents(updatedEvents);
    setShowEditModal(false);
    setSelectedEvent(null);
    setEventFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      clubId: null
    });
  };

  const handleDeleteConfirm = () => {
    setEvents(events.filter(event => event.id !== selectedEvent.id));
    setShowDeleteModal(false);
    setSelectedEvent(null);
  };

  // Filter events based on followed clubs and search
  const filteredEvents = events.filter(event => {
    const isFromFollowedClub = followedClubs.find(
      club => club.id === event.clubId && (club.isFollowed || club.organizerId === currentUserId)
    );
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return isFromFollowedClub && (matchesSearch || !searchQuery);
  });

  return (
    <div className="main-container">
      <div className="content-box">
        {/* Clubs you organize */}
        <div className="clubs-managing">
          <h3>Your Clubs</h3>
          <div className="clubs-grid">
            {followedClubs
              .filter(club => club.organizerId === currentUserId)
              .map(club => (
                <div key={club.id} className="club-manage-item">
                    <span className="club-name">{club.name}</span>
                    <button
                        className="create-event-button"
                        onClick={() => handleCreateEvent(club.id)}
                        >
                         + New Event
                </button>
                </div>
              ))}
          </div>
        </div>

        {/* Clubs you can follow */}
        <div className="clubs-following">
          <h3>Available Clubs</h3>
          <div className="clubs-grid">
            {followedClubs
              .filter(club => club.organizerId !== currentUserId)
              .map(club => (
                <div key={club.id} className="club-follow-item">
                  <span className="club-name">{club.name}</span>
                  <button
                    className={`follow-button ${club.isFollowed ? 'following' : ''}`}
                    onClick={() => handleFollowClub(club.id)}
                  >
                    {club.isFollowed ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Events list */}
        <div className="events-section">
          <h2>Events</h2>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="events-list">
            {filteredEvents.length === 0 ? (
              <div className="no-events">
                No events found. Try following more clubs or adjusting your search.
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-content">
                    <div className="event-header">
                      <h3 className="event-title">{event.title}</h3>
                      <span className="event-club">{event.clubName}</span>
                    </div>
                    <p className="event-description">{event.description}</p>
                    <div className="event-details">
                      <span className="detail-item">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </span>
                      <span className="detail-item">
                        <span className="detail-label">Time:</span>
                        <span className="detail-value">{event.time}</span>
                      </span>
                      <span className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{event.location}</span>
                      </span>
                    </div>
                  </div>
                  {canManageEvent(event) && (
                    <div className="event-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteEvent(event)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Event</h2>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    title: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    description: e.target.value
                  })}
                  required
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={eventFormData.date}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    date: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={eventFormData.time}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    time: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={eventFormData.location}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    location: e.target.value
                  })}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Event</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    title: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    description: e.target.value
                  })}
                  required
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={eventFormData.date}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    date: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={eventFormData.time}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    time: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={eventFormData.location}
                  onChange={(e) => setEventFormData({
                    ...eventFormData,
                    location: e.target.value
                  })}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Event Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Delete Event</h2>
            <p>Are you sure you want to delete "{selectedEvent?.title}"?</p>
            <div className="modal-buttons">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFeed;