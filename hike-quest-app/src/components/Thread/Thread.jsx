import PropTypes from 'prop-types';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from "../../state/app.context";
import { deleteThread, dislikeThread, likeThread } from '../../services/threads.service';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, update } from 'firebase/database';
import UpdateThreadModal from '../UpdateThreadModal/UpdateThreadModal';
import { weatherAPI } from '../../common/constants.js';
import ThumbsUp from '../icons/ThumbsUpOutline.jsx';
import ThumbsUpFilled from "../../components/icons/ThumbsUpFilled.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { getUserByHandle } from '../../services/users.service.js';

/**
 * Thread component displays information about a specific thread, including its content, author, and weather data.
 * Provides functionality for liking, disliking, editing, and deleting the thread.
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.thread - The thread data
 * @param {string} props.thread.id - The unique identifier of the thread
 * @param {string} props.thread.author - The author of the thread
 * @param {string} props.thread.title - The title of the thread
 * @param {string} props.thread.content - The content of the thread
 * @param {string} props.thread.createdOn - The creation date of the thread
 * @param {string} props.thread.location - The location associated with the thread
 * @param {Array<string>} props.thread.likedBy - List of user handles who liked the thread
 * 
 * @returns {JSX.Element} The rendered Thread component
 */
export default function Thread({ thread }) {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [currentThread, setCurrentThread] = useState(thread);
  const [authorType, setAuthorType] = useState();

  useEffect(() => {
    /**
     * Fetches the author information to determine if the author is an admin.
     * Sets the authorType state based on the author's role.
     */
    const userType = async () => {
      try {
        const authorInfo = await getUserByHandle(thread.author);
        setAuthorType(authorInfo.isAdmin);
      } catch (e) {
        // Handle error if needed
      }
    };
    userType();
  }, [thread.author]);

  /**
   * Toggles the like status of the thread for the current user.
   * Updates the thread's likedBy list accordingly.
   */
  const toggleLike = async () => {
    const isLiked = thread.likedBy.includes(userData.handle);
    try {
      if (isLiked) {
        await dislikeThread(userData.handle, thread.id);
      } else {
        await likeThread(userData.handle, thread.id);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /**
   * Handles the deletion of the thread.
   * Prompts the user for confirmation before deleting.
   * If confirmed, deletes the thread and navigates to the threads list.
   */
  const handleDeleteThread = async () => {
    if (thread.author !== userData.handle && !userData.isAdmin) {
      return toast.error('Not authorised!');
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(99, 236, 112)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        await deleteThread(thread.id);
        toast.success('Thread deleted successfully.');
        navigate('/threads');
      } catch (error) {
        toast.error('Failed to delete the thread: ' + error.message);
      }
    }
  };

  /**
   * Opens the update thread modal.
   */
  const openModal = () => {
    setShowModal(true);
  };

  /**
   * Closes the update thread modal.
   */
  const closeModal = () => {
    setShowModal(false);
  };

  /**
   * Handles the submission of updated thread data.
   * Updates the thread information in the database.
   * Closes the modal on successful update.
   * 
   * @param {Event} e - The form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedThread = {
      ...currentThread,
    };

    const db = getDatabase();
    update(ref(db, `threads/${updatedThread.id}`), {
      title: currentThread.title,
      content: currentThread.content,
    }).then(() => {
      closeModal();
    }).catch((error) => {
      toast.error("Error updating thread: ", error);
    });
  };

  useEffect(() => {
    /**
     * Fetches weather data for the thread's location from the OpenWeather API.
     * Sets the weatherData state with the retrieved data.
     */
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${thread.location}&units=metric&appid=${weatherAPI}`
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data));
  }, [thread.location]);

  return (
    <div className='threadContainer'>
      <div className='userContainer'>
        <div className='userInfo'>
          <img
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="profile-pic"
            className="profilePic"
          />
          <div>
            <p className='userName'>{thread.author}</p>
            <p className='userType'>user type: {authorType ? 'pro hiker' : 'hiker'}</p>
          </div>
        </div>
        <div>
          {(thread.author === userData?.handle || userData?.isAdmin) && (
            <button className="threadButtons" onClick={handleDeleteThread}>Delete</button>
          )}
          {(thread.author === userData?.handle && !userData.isBlocked) && (
            <button className="threadButtons" onClick={openModal}>Edit</button>
          )}
        </div>
      </div>
      <p className='threadDate'>{new Date(thread.createdOn).toDateString()}</p>
      <h2 className='threadTitle'>{thread.title}</h2>
      <hr />
      <p className='actualThread'>{thread.content}</p>
      <hr />
      {weatherData?.cod === 200 && (
        <div className='weatherContainer'>
          <h3>Weather at {thread.location}</h3>
          <div>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt="weather icon"
            />
          </div>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Wind: {weatherData.wind.speed} m/s</p>
          <p>Visibility: {weatherData.visibility} m</p>
        </div>
      )}
      <div className='buttonContainer'>
        <button className={`threadButtons ${thread.likedBy.includes(userData?.handle) ? 'like1' : 'like0'}`} style={{ display: 'flex', alignItems: 'center' }} onClick={toggleLike}>
          {thread.likedBy.includes(userData?.handle) ? <ThumbsUpFilled /> : <ThumbsUp />}
          {thread.likedBy.length}
        </button>
      </div>
      <UpdateThreadModal
        show={showModal}
        handleClose={closeModal}
        handleSubmit={handleSubmit}
        thread={currentThread}
        setThread={setCurrentThread}
      />
      <ToastContainer />
    </div>
  );
}

Thread.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    likedBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
