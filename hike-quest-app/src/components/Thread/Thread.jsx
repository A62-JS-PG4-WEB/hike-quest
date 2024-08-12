
import PropTypes from 'prop-types';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from "../../state/app.context"
import { deleteThread, dislikeThread, likeThread } from '../../services/threads.service';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, update } from 'firebase/database';
import UpdateThreadModal from '../UpdateThreadModal/UpdateThreadModal';
import { weatherAPI } from '../../common/constants.js'
import ThumbsUp from '../icons/ThumbsUpOutline.jsx';
import ThumbsUpFilled from '../icons/ThumbsUpFilled.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';



/**
 * 
 * @param {{ thread: {
 *  id: string,
 *  author: string,
 *  title: string,
 *  content: string,
 *  createdOn: string,
 *  location: string,
 *  likedBy?: string[]
 * } }} props 
 * @returns 
 */
export default function Thread({ thread }) {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [weatherData, setWeatherData] = useState({})
  const [currentThread, setCurrentThread] = useState(thread);

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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedThread = {
      ...currentThread,
    };

    const db = getDatabase();
    update(ref(db, `threads/${updatedThread.id}`, updatedThread), {
      title: currentThread.title,
      content: currentThread.content,


      // location: currentThread.location,

    }).then(() => {
      closeModal();
    }).catch((error) => {
      toast.error("Error updating thread: ", error);
    });
  };

  useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      thread.location +
      "&units=metric&appid=" +
      weatherAPI
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data));
  }, [])


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
            <p className='userType'> User type: { }</p>
          </div>
        </div>
        <div>
          {(thread.author === userData?.handle || userData?.isAdmin) && (
            <button className="threadButtons" onClick={handleDeleteThread}>Delete</button>
          )}
          {(thread.author === userData?.handle && !userData.isBlocked) && 
           (<button className="threadButtons" onClick={openModal}>Edit</button>

           )}
          
        </div>
      </div>
      <p className='threadDate'> {new Date(thread.createdOn).toDateString()}</p>
      <h2 className='threadTitle'>{thread.title}</h2>
      <hr></hr>


      {/* <p className='hashtag'> {thread.hashtag}</p> */}


      <p className='actualThread'>{thread.content}</p>
      <hr></hr>
      {(weatherData?.cod === 200) && (
        <div className='weatherContainer'>
          <h3>Weather at {thread.location}</h3>
          <div >
            <img

              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            /></div>

          <p>Temperature: {weatherData.main.temp} °C </p>

          <p>Wind: {weatherData.wind.speed} m/s</p>
          <p>Visibility: {weatherData.visibility} m</p>

        </div>

      )}

      <div className='buttonContainer'>
        <button className={`threadButtons ${thread.likedBy.includes(userData?.handle) ? 'like1' : 'like0'}`} style={{ display: 'flex', alignItems: 'center' }} onClick={toggleLike}>{thread.likedBy.includes(userData?.handle) ? <ThumbsUpFilled /> : <ThumbsUp />} {thread.likedBy.length}</button>
      </div>

      <UpdateThreadModal
        show={showModal}
        handleClose={closeModal}
        handleSubmit={handleSubmit}
        thread={currentThread}
        setThread={setCurrentThread}
      />
    </div >


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