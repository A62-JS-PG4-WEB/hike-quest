import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { AppContext } from "../../state/app.context"
import { deleteThread, dislikeThread, likeThread } from '../../services/threads.service';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, update } from 'firebase/database';
import UpdateThreadModal from '../UpdateThreadModal/UpdateThreadModal';

/**
 * 
 * @param {{ thread: {
 *  id: string,
 *  author: string,
 *  title: string,
 *  content: string,
 *  createdOn: string,
 *  likedBy?: string[]
 * } }} props 
 * @returns 
 */
export default function Thread({ thread }) {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
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
      alert(error.message);
    }
  };

  const handleDeleteThread = async () => {
    if (thread.author !== userData.handle && !userData.isAdmin) {
      return alert('Not authorised!');
    }
    try {
      await deleteThread(thread.id);
      alert('Thread deleted successfully.');
      navigate('/threads');
    } catch (error) {
      alert('Failed to delete the thread: ' + error.message);
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
    const db = getDatabase();
    update(ref(db, `threads/${currentThread.id}`), {
      title: currentThread.title,
      content: currentThread.content,
    }).then(() => {
      closeModal();
    }).catch((error) => {
      console.error("Error updating thread: ", error);
    });
  };

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
            <>
              <button className="threadButtons" onClick={handleDeleteThread}>Delete</button>
            </>
          )}
          {thread.author === userData?.handle && <button className="threadButtons" onClick={openModal}>Edit</button>}

        </div>
      </div>
      <h2 className='threadTitle'>{thread.title}</h2>
      <p className='threadTitle'> {new Date(thread.createdOn).toLocaleDateString()}</p>


      <p className='actualThread'>{thread.content}</p>
      <div className='buttonContainer'>
        <button className="threadButtons" onClick={toggleLike}>{thread.likedBy.includes(userData?.handle) ? 'Dislike' : 'Like'}</button>
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
    likedBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};