import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchPostsByTag, getAllThreads } from "../../services/threads.service";
import AllThreads from "../AllThreads/AllThreads";
import { MAX_CONTENT_TO_SHOW, MIN_CONTENT_TO_SHOW } from "../../common/constants";
import { AppContext } from "../../state/app.context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function TagPosts() {
  const { id } = useParams();
  const location = useLocation();
  const { tagName } = location.state || {};
  const [posts, setPosts] = useState([]);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();


  useEffect(() => {
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
