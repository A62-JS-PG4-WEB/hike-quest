import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { addCommentToThread, getCommentsByThread } from "../../services/threads.service";
import Comment from "../Comment/Comment";
import PropTypes from 'prop-types';
import '../../views/SingleThread/SingleThread.css'


export default function Comments({ threadId }) {
    const { userData } = useContext(AppContext);

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };


    useEffect(() => {
        getCommentsByThread(threadId).then(setComments)
    }, [threadId])

    const handleCreateComment = async () => {


        if (!comment.trim()) {
            return alert("Comment cannot be empty.");
        }

        try {
            await addCommentToThread(threadId, {
                text: comment,
                author: userData.handle,
                createdOn: new Date().toISOString(),
            });
            setComment('');
            alert("Comment added successfully.");

        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment.");
        }
    };

    return (
        <div>
            <div className="commentSection">
                <textarea
                    className="commentBox"
                    value={comment}
                    onChange={handleCommentChange}
                    name="comment"
                    id="comment"
                    placeholder="Add a comment..."
                /><br /><br />
                <div className="commentButton">
                    <button className="threadButtons" onClick={handleCreateComment}>Comment</button>
                </div>
                <p className="commentsHeader">Comments</p>
                <hr></hr>
            </div>
            {comments.map(c => (<Comment key={c.id} comment={c} />))}
        </div>

    );
}

Comments.propTypes = {
    threadId: PropTypes.string.isRequired,
};