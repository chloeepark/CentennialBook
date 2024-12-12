import React, { useState } from 'react';
import "./ClubManagement.css";

const ClubManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [clubs, setClubs] = useState([
    { id: 1, name: "BJJ Club", description: "Learn self-defense and improve fitness.", category: "Sports" },
    { id: 2, name: "Programming Society", description: "A community of coding enthusiasts.", category: "Technology" },
    { id: 3, name: "Business & Entrepreneurship Club", description: "Connect with fellow entrepreneurs.", category: "Business" },
    { id: 4, name: "Photography Club", description: "Explore your creativity through photography.", category: "Arts" },
    { id: 5, name: "International Students Association", description: "Celebrate cultural diversity.", category: "Culture" }
  ]);
  const [formData, setFormData] = useState({ name: '', description: '', category: '' });

  const handleCreateClick = () => {
    setFormData({ name: '', description: '', category: '' });
    setShowCreateModal(true);
  };

  const handleEditClick = (club) => {
    setSelectedClub(club);
    setFormData({ name: club.name, description: club.description, category: club.category });
    setShowEditModal(true);
  };

  const handleDeleteClick = (club) => {
    setSelectedClub(club);
    setShowDeleteModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newClub = { id: clubs.length + 1, ...formData };
    setClubs([...clubs, newClub]);
    setShowCreateModal(false);
    setFormData({ name: '', description: '', category: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedClubs = clubs.map(club =>
      club.id === selectedClub.id ? { ...club, ...formData } : club
    );
    setClubs(updatedClubs);
    setShowEditModal(false);
    setSelectedClub(null);
    setFormData({ name: '', description: '', category: '' });
  };

  const handleDelete = () => {
    const updatedClubs = clubs.filter(club => club.id !== selectedClub.id);
    setClubs(updatedClubs);
    setShowDeleteModal(false);
    setSelectedClub(null);
  };

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase())
      || club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? club.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="main-container">
      <div className="content-box">
      <div className="filter-bar">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          <option value="Sports">Sports</option>
          <option value="Technology">Technology</option>
          <option value="Business">Business</option>
          <option value="Arts">Arts</option>
          <option value="Culture">Culture</option>
        </select>
        <input
          type="text"
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
        <button className="create-button" onClick={handleCreateClick}>
          + Create New
        </button>

        <div className="club-list">
          {filteredClubs.map(club => (
            <div key={club.id} className="club-item">
              <div className="club-content">
                <h3 className="club-name">{club.name}</h3>
                <p className="club-description">{club.description}</p>
                <p className="club-category">Category: {club.category}</p>
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Sports">Sports</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Culture">Culture</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowCreateModal(false)} className="cancel-button">
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Sports">Sports</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Culture">Culture</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowEditModal(false)} className="cancel-button">
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
              <button onClick={() => setShowDeleteModal(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleDelete} className="delete-button">
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