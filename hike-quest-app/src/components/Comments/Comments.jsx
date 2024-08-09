import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
import { AppContext } from "../../state/app.context";
import { addCommentToThread, getCommentsByThread, updateCommentInThread, deleteCommentFromThread } from "../../services/threads.service";
import Comment from "../Comment/Comment";
import PropTypes from 'prop-types';
import '../../views/SingleThread/SingleThread.css'




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
                author: userData?.handle,
                createdOn: new Date().toISOString(),
            };
            await addCommentToThread(threadId, newComment);
            setComment('');
            const fetchedComments = await getCommentsByThread(threadId);
            setComments(sortComments(fetchedComments, sortOrder));
            alert("Comment added successfully.");
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
        try {
            await deleteCommentFromThread(threadId, commentId);
            const fetchedComments = await getCommentsByThread(threadId);
            setComments(sortComments(fetchedComments, sortOrder));
            alert("Comment deleted successfully.");
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment.");
        }
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    if (!userData) {
        return <p>Loading user data...</p>; 
    }

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

            {!userData?.isBlocked && 
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
                    <br/>
                </div>
            }

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
                    isBlocked={userData.isBlocked}
                />
            ))}
        </div>

    );
}

Comments.propTypes = {
    threadId: PropTypes.string.isRequired,

};

};

