import React, { useState } from 'react';
import "./ClubManagement.css";

const ClubManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubs, setClubs] = useState([
    { 
      id: 1, 
      name: "BJJ Club", 
      description: "Join our Brazilian Jiu-Jitsu club to learn self-defense, improve fitness, and compete in tournaments. All skill levels welcome, with dedicated training sessions for beginners and advanced practitioners." 
    },
    {
      id: 2,
      name: "Programming Society",
      description: "A community of coding enthusiasts who meet weekly to work on projects, participate in hackathons, and share programming knowledge. We cover everything from web development to artificial intelligence."
    },
    {
      id: 3,
      name: "Business & Entrepreneurship Club",
      description: "Connect with fellow entrepreneurs, participate in startup competitions, and learn from successful business leaders. Regular workshops on business planning, marketing, and leadership skills."
    },
    {
      id: 4,
      name: "Photography Club",
      description: "Explore your creativity through photography. Weekly photo walks, monthly exhibitions, and workshops on digital and film photography. Equipment provided for beginners. All skill levels welcome."
    },
    {
      id: 5,
      name: "International Students Association",
      description: "A vibrant community celebrating cultural diversity. Regular cultural events, food festivals, and social gatherings. Help with adaptation to university life and creating connections across cultures."
    }
  ]);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleCreateClick = () => {
    setFormData({ name: '', description: '' });
    setShowCreateModal(true);
  };

  const handleEditClick = (club) => {
    setSelectedClub(club);
    setFormData({
      name: club.name,
      description: club.description
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (club) => {
    setSelectedClub(club);
    setShowDeleteModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newClub = {
      id: clubs.length + 1,
      ...formData
    };
    setClubs([...clubs, newClub]);
    setShowCreateModal(false);
    setFormData({ name: '', description: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedClubs = clubs.map(club => 
      club.id === selectedClub.id ? { ...club, ...formData } : club
    );
    setClubs(updatedClubs);
    setShowEditModal(false);
    setSelectedClub(null);
    setFormData({ name: '', description: '' });
  };

  const handleDelete = () => {
    const updatedClubs = clubs.filter(club => club.id !== selectedClub.id);
    setClubs(updatedClubs);
    setShowDeleteModal(false);
    setSelectedClub(null);
  };

  return (
    <div className="main-container">
      <div className="content-box">
        <button className="create-button" onClick={handleCreateClick}>
          + Create New
        </button>

        <div className="club-list">
          {clubs.map(club => (
            <div key={club.id} className="club-item">
              <div className="club-content">
                <h3 className="club-name">{club.name}</h3>
                <p className="club-description">{club.description}</p>
              </div>
              <div className="action-buttons">
                <button 
                  className="edit-button"
                  onClick={() => handleEditClick(club)}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteClick(club)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Club</h2>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label>Club Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Enter club name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  placeholder="Enter club description"
                  rows="4"
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Club</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Club Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Enter club name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  placeholder="Enter club description"
                  rows="4"
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

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Delete Club</h2>
            <p>Are you sure you want to delete "{selectedClub?.name}"?</p>
            <div className="modal-buttons">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
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

export default ClubManagement;