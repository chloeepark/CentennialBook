import React, { useState } from 'react';
import axios from 'axios';
import './CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('/api/posts/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Post created successfully!');
      setTitle('');
      setContent('');
      setImage(null);
    } catch {
      setMessage('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="create-post-header">Create a New Post</h1>
      {message && <p className={`create-post-message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>}
      <form className="create-post-form" onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="create-post-input"
          />
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="create-post-textarea"
          />
        </label>
        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="create-post-file-input"
          />
        </label>
        <button type="submit" disabled={isLoading} className="create-post-button">
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
