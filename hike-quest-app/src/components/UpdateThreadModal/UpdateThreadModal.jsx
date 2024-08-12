import PropTypes from 'prop-types';
import '../../views/SingleThread/SingleThread.css'
import Tags from '../Tags/Tags';


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

        <h2>Update Thread</h2>
        <form onSubmit={handleSubmit}>
          <input type="hidden" value={thread.id} />
          <label className="createTitle" htmlFor="title">Title:</label>
          <input
            className='commentBox'
            type="text"
            id="title"
            name="title"
            value={thread.title}
            onChange={onChange}
            required
          />
          <label className="createContent" htmlFor="content">Content:</label>
          <textarea
            className='commentBox'
            id="content"
            name="content"
            value={thread.content}
            onChange={onChange}
            required
          />
          <Tags thread={thread} />
          <button className="threadButtons" onClick={handleClose}>Cancel</button>
          <button className="threadButtons" type="submit">Update</button>

        </form>
      </div>
    </div>
  );
};

UpdateThreadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  thread: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    uid: PropTypes.string
  }).isRequired,
  setThread: PropTypes.func.isRequired,
};

export default UpdateThreadModal;