import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
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
                console.log("tags use eff", tags);
                setTags(tags);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchThreadData();
    }, [id]);

    return (
        <div>
            {thread && <Thread thread={thread} />}
            {tags.length > 0 ? (
                    tags.map((tag, index) => (
                        <span key={index} style={{ marginRight: '5px' }}>#{tag}</span>
                    ))
                ) : (
                    <p>No tags added</p>
                )}
            {thread && <Comments threadId={id} />}
        </div>
    )
}














