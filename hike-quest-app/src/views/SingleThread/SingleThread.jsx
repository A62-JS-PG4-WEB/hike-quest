import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import Thread from '../../components/Thread/Thread';
import { onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import Comments from "../../components/Comments/Comments";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteTag, fetchTagsForPost } from "../../services/threads.service";
import { AppContext } from "../../state/app.context";

/**
 * SingleThread component displays details of a specific thread, including its tags and comments.
 * 
 * It fetches the thread data and associated tags from Firebase, handles tag deletion, and displays comments.
 * It also conditionally renders tag deletion buttons if the current user is the author of the thread.
 *
 * @component
 * @example
 * // Example usage:
 * // <SingleThread />
 *
 * @returns {JSX.Element} The SingleThread component
 */
export default function SingleThread() {
    const [thread, setThread] = useState(null);
    const [tags, setTags] = useState([]);
    const { id } = useParams();
    const { userData } = useContext(AppContext);

    useEffect(() => {
        /**
         * Fetches thread data and associated tags from Firebase.
         * Updates the component state with the fetched thread and tags.
         */
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
                toast.error('Error fetching data:', error);
            }
        };

        fetchThreadData();
    }, [id]);

    /**
     * Deletes a tag from the thread and updates the state.
     *
     * @param {string} tagName - The name of the tag to delete.
     */
    const handleDeleteTag = async (tagName) => {
        try {
            await deleteTag(thread.id, tagName);
            const updatedTags = tags.filter(tag => tag !== tagName);
            toast.success('Tag removed');
            setTags(updatedTags);
        } catch (error) {
            toast.error(error.message);
        }
    };

    /**
     * Handles the click event for deleting a tag.
     *
     * @param {React.MouseEvent} e - The click event.
     * @param {string} tag - The tag to delete.
     */
    const handleDeleteClick = (e, tag) => {
        e.stopPropagation();
        e.preventDefault();
        handleDeleteTag(tag);
    };

    return (
        <div>
            {thread && <Thread thread={thread} />}
            <div className="tags">
                {tags.length > 0 ? (
                    tags.map((tag) => (
                        <Link
                            key={tag.id}
                            state={{ tagName: tag.name }}
                            to={`/tag-posts/${tag.id}`}
                        >
                            #{tag.name}
                            {userData.handle === thread.author &&
                                (<button
                                    className="deleteTagButton"
                                    onClick={(e) => handleDeleteClick(e, tag.id)}
                                >
                                    X
                                </button>)

                            }
                        </Link>
                    ))
                ) : (
                    <p>No tags added</p>
                )}
            </div>

            {thread && <Comments threadId={id} />}
        </div>
    )
}














