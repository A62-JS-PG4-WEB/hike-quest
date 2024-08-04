import PropType from 'prop-types';
import { useContext } from 'react';
import { AppContext } from "../../state/app.context"
import { dislikeThread, likeThread } from '../../services/threads.service';

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
  const toggleLike = async () => {
    const isLiked = thread.likedBy.includes(userData.handle);
    console.log(userData);
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

  return (
    <div>
      <h3>{thread.title}</h3>
      <p>{thread.content}</p>
      <p>Created on: {new Date(thread.createdOn).toLocaleDateString()}</p>
      <p>Created by: {thread.author}</p>
      <button onClick={toggleLike}>{thread.likedBy.includes(userData?.handle) ? 'Dislike' : 'Like'}</button>
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