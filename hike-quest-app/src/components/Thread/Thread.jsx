import PropType from 'prop-types';
import { useContext } from 'react';
import { AppContext } from "../../state/app.context"
import { deleteThread, dislikeThread, likeThread } from '../../services/threads.service';
import { useNavigate } from 'react-router-dom';

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
  const { user, userData } = useContext(AppContext);
  const navigate = useNavigate();



  const toggleLike = async () => {
    // console.log( thread.author);
    // console.log(userData.handle,);
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

    if (thread.author !== user.handle) {
      return alert('Not authorised!');
    }
    if (userData)
    try {
      await deleteThread(thread.id);
      alert('Thread deleted successfully.');
      navigate('/threads')
    } catch (error) {
      alert('Failed to delete the thread: ' + error.message);
    }
  };


  return (
    <div>
      <h3>{thread.title}</h3>
      <p>{thread.content}</p>
      <p>Created on: {new Date(thread.createdOn).toLocaleDateString()}</p>
      <p>Created by: {thread.author}</p>
      <button onClick={toggleLike}>{thread.likedBy.includes(userData?.handle) ? 'Dislike' : 'Like'}</button>
      <button onClick={handleDeleteThread}>Delete </button>
    </div>
  )
}

Thread.propTypes = {
  thread: PropType.shape({
    id: PropType.string,
    author: PropType.string,
    title: PropType.string,
    content: PropType.string,
    createdOn: PropType.string,
    likedBy: PropType.arrayOf(PropType.string),
  })
}