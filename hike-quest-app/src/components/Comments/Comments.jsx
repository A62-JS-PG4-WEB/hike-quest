import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
import Picker from '@emoji-mart/react';
import { AppContext } from "../../state/app.context";
import { addCommentToThread, getCommentsByThread, updateCommentInThread, deleteCommentFromThread } from "../../services/threads.service";
import Comment from "../Comment/Comment";

export default function Comments({ threadId }) {
    const { userData } = useContext(AppContext);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [sortOrder, setSortOrder] = useState('newest');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            const fetchedComments = await getCommentsByThread(threadId);
            setComments(sortComments(fetchedComments, sortOrder));
        };

        fetchComments();
    }, [threadId, sortOrder]);

    const sortComments = (comments, order) => {
        return comments.sort((a, b) => {
            if (order === 'newest') {
                return new Date(b.createdOn) - new Date(a.createdOn);
            } else {
                return new Date(a.createdOn) - new Date(b.createdOn);
            }
        });
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const addEmoji = (emoji) => {
        setComment((prevComment) => prevComment + emoji.native);
    };

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
            const fetchedComments = await getCommentsByThread(threadId);
            setComments(sortComments(fetchedComments, sortOrder));
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment.");
        }
    };

    const handleUpdateComment = async (commentId, updatedText) => {
        try {
            await updateCommentInThread(threadId, commentId, updatedText);
            alert("Comment updated successfully.");
            const fetchedComments = await getCommentsByThread(threadId);
            setComments(sortComments(fetchedComments, sortOrder));
        } catch (error) {
            console.error("Error updating comment:", error);
            alert("Failed to update comment.");
        }
    };

    const handleDeleteComment = async (commentId) => {
    {
            try {
                await deleteCommentFromThread(threadId, commentId);
                const fetchedComments = await getCommentsByThread(threadId);
                setComments(sortComments(fetchedComments, sortOrder));
                alert("Comment deleted successfully.");
            } catch (error) {
                console.error("Error deleting comment:", error);
                alert("Failed to delete comment.");
            }
        }
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
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
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    {showEmojiPicker ? "Close Emoji Picker" : "Add Emoji"}
                </button>
                {showEmojiPicker && (
                    <Picker onEmojiSelect={addEmoji} />
                )}
                <button onClick={handleCreateComment}>Comment</button>
                <div className="userInfo">
                    <h3 className="userName">{userData ? userData.handle : "Username"}</h3>
                </div>
            </div>

            <div className="sortOptions">
                <label htmlFor="sortOrder">Sort by:</label>
                <select id="sortOrder" value={sortOrder} onChange={handleSortChange}>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {comments.map(c => (
                <Comment
                    key={c.id}
                    comment={c}
                    onUpdateComment={handleUpdateComment}
                    onDeleteComment={handleDeleteComment}
                    currentUser={userData.handle}
                />
            ))}
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