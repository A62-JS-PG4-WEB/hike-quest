import React from 'react';
import PropTypes from 'prop-types';

const UpdateThreadModal = ({ show, handleClose, handleSubmit, thread, setThread }) => {
  if (!show) {
    return null;
  }

  const onChange = (e) => {
    setThread({ ...thread, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>Update Thread</h2>
        <form onSubmit={handleSubmit}>
          <input type="hidden" value={thread.id} />
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={thread.title}
            onChange={onChange}
            required
          />
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={thread.content}
            onChange={onChange}
            required
          />
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

UpdateThreadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  thread: PropTypes.object.isRequired,
  setThread: PropTypes.func.isRequired,
};

export default UpdateThreadModal;