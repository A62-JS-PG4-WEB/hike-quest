import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { addCommentToThread, getCommentsByThread } from "../../services/threads.service";
import Comment from "../Comment/Comment";
import PropTypes from 'prop-types';

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
            const newComment = {
                text: comment,
                author: userData.handle,
                createdOn: new Date().toISOString(),
            }
            await addCommentToThread(threadId, newComment);
            setComment('');
            setComments(prevComments => [...prevComments, newComment]);
            alert("Comment added successfully.");

        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment.");
        }
    };

    return (
        <div>
            <div className="userContainer">
                <textarea
                    value={comment}
                    onChange={handleCommentChange}
                    name="comment"
                    id="comment"
                    placeholder="Write your comment here..."
                /><br /><br />
                <button onClick={handleCreateComment}>Comment</button>
                <div className="userInfo">
                    <h3 className="userName">{userData ? userData.handle : "Username"}</h3>
                </div>
            </div>
            {comments.map(c => (<Comment key={c.id} comment={c} />))}
        </div>
    );
}

Comments.propTypes = {
    threadId: PropTypes.string.isRequired,
};

{/* <>
        <div className="singleComment">
                    <div className="userContainer">
                            <img 
                            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                            alt="profile-pic" 
                            className="profilePic"
                            />
                            <div className="userInfo">
                                <h3 className="userName">Username</h3>
                                <p className="userType">User type: {}</p>
                            </div>
                    </div>
                    <p className="actualComment">commencommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentt</p>
                </div>
        
        
        
        </> */}