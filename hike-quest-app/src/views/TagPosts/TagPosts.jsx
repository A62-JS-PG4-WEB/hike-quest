import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteThread, fetchPostsByTag, getAllThreads } from "../../services/threads.service";
import { MAX_CONTENT_TO_SHOW, MIN_CONTENT_TO_SHOW } from "../../common/constants";
import { AppContext } from "../../state/app.context";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import '../../views/SingleThread/SingleThread.css'

/**
 * TagPosts component fetches and displays all threads associated with a specific tag
 * and displays them in a list.
 *
 * @component
 * @example
 * return (
 *   <TagPosts />
 * )
 */
export default function TagPosts() {
  const { id } = useParams();
  const location = useLocation();
  const { tagName } = location.state || {};
  const [posts, setPosts] = useState([]);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Fetches all threads and filters them by the specified tag.
     * The filtered threads are then set to the state for rendering.
     */
    const fetchThreads = async () => {
      try {
        const allposts = await getAllThreads();
        const filteredPromises = allposts.map(async (thread) => {
          const exists = await fetchPostsByTag(thread.id, id);
          return exists ? thread : null;
        });

        const results = await Promise.all(filteredPromises);
        const filteredThreads = results.filter(thread => thread !== null);
        setPosts(filteredThreads);
      } catch (error) {
        toast.error('Error fetching posts:', error);
      }
    };

    fetchThreads();
  }, [id]);

  /**
  * Handles the deletion of a thread after user confirmation.
  * Uses SweetAlert2 for confirmation dialog and deletes the thread if confirmed.
  *
  * @param {string} threadId - The ID of the thread to delete.
  */
  const handleDeleteThread = async (threadId) => {
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
        await deleteThread(threadId);
        setPosts(posts.filter(thread => thread.id !== threadId));
      } catch (error) {
        toast.error('Error deleting thread: ' + error.message || error);
      }
    }
  };
  return (
    <div>
      <h1>All Threads for #{tagName}</h1>
      {posts.length > 0 ? (
        posts.map(t => (
          <div key={t.id} className="threadItem">
            <p><strong>{t.title}</strong> by {t.author} <small>{new Date(t.createdOn).toDateString()}</small></p>
            <p>{t.content.slice(MIN_CONTENT_TO_SHOW, MAX_CONTENT_TO_SHOW)}...</p>
            <p>Likes: {t.likeCount} | Comments: {t.commentCount}</p>
            <button onClick={() => navigate(`/threads/${t.id}`)}>See more</button>
            {(t.author === userData?.handle || userData?.isAdmin) && (
              <>
                <button onClick={() => handleDeleteThread(t.id)}>Delete</button>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No threads found for this tag.</p>
      )}
    </div>
  );
}
