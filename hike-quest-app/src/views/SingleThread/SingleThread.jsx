import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import Thread from '../../components/Thread/Thread';
import { onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import Comments from "../../components/Comments/Comments";
import { fetchTagsForPost } from "../../services/threads.service";

export default function SingleThread() {
    const [thread, setThread] = useState(null);
    const [tags, setTags] = useState([])
    const { id } = useParams();
  
    useEffect(() => {

        const fetchThreadData = async () => {
            try {
                const threadRef = ref(db, `threads/${id}`);
                onValue(threadRef, (snapshot) => {
                    const updatedThread = snapshot.val();
                    setThread({
                        ...updatedThread,
                        likedBy: Object.keys(updatedThread.likedBy ?? {}),
                    });
                });

                const tags = await fetchTagsForPost(id);
                setTags(tags);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchThreadData();
    }, [id]);

    const handleDeleteTag = async (tagName) => {
        try {
        //   await deleteTag(thread.id, tagName);
        const updatedTags = tags.filter(tag => tag !== tagName);
        setTags(updatedTags);
        } catch (error) {
          alert(error.message);
        }
      };

    const handleDeleteClick = (e, tag) => {
        e.stopPropagation(); 
        e.preventDefault();
        handleDeleteTag(tag);
      };

    return (
        <div>
            {thread && <Thread thread={thread} />}
            {tags.length > 0 ? (
                tags.map((tag) => (
                    <Link
                        key={tag.id}
                        state={{ tagName: tag.name }}
                        to={`/tag-posts/${tag.id}`}
                    >
                        #{tag.name}
                        <button
                            className="deleteTagButton"
                           onClick={(e) => handleDeleteClick(e, tag)}
                        >
                            X
                        </button>
                    </Link>
                ))
            ) : (
                <p>No tags added</p>
            )}
            {thread && <Comments threadId={id} />}
        </div>
    )
}














