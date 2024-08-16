import PropTypes from 'prop-types';
import '../../views/SingleThread/SingleThread.css';
import Tags from '../Tags/Tags';

/**
 * UpdateThreadModal component provides a modal interface for updating a thread -
 * title and content of the thread, and includes a tags component.
 * 
 * @param {Object} props - Component properties
 * @param {boolean} props.show - Determines whether the modal is visible or not
 * @param {Function} props.handleClose - Function to close the modal
 * @param {Function} props.handleSubmit - Function to handle form submission
 * @param {Object} props.thread - The thread object to be updated
 * @param {string} props.thread.id - The unique identifier of the thread
 * @param {string} props.thread.title - The title of the thread
 * @param {string} props.thread.content - The content of the thread
 * @param {Function} props.setThread - Function to update the thread state
 * 
 * @returns {JSX.Element|null} The rendered modal component or null if `show` is false
 */
const UpdateThreadModal = ({ show, handleClose, handleSubmit, thread, setThread }) => {
  if (!show) {
    return null;
  }

  /**
   * Handles input changes and updates the thread state.
   * 
   * @param {Event} e - The change event
   */
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
          <div>
            <Tags thread={thread} />
          </div>
          <button className="threadButtonsCancel" type="button" onClick={handleClose}>Cancel</button>
          <button className="threadButtons" type="submit">Submit</button>
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
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    uid: PropTypes.string
  }).isRequired,
  setThread: PropTypes.func.isRequired,
};

export default UpdateThreadModal;
