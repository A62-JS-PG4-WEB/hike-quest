import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
import { AppContext } from "../../state/app.context";
import { addCommentToThread, getCommentsByThread, updateCommentInThread, deleteCommentFromThread } from "../../services/threads.service";
import Comment from "../Comment/Comment";
import '../../views/SingleThread/SingleThread.css'
import Picker from '@emoji-mart/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            return toast.error("Comment cannot be empty.");
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
            toast.success("Comment added successfully.");
        } catch (error) {
            toast.error("Error adding comment:", error);
        }
    };

    const handleUpdateComment = async (commentId, updatedText) => {
        try {
            await updateCommentInThread(threadId, commentId, updatedText);
            toast.success("Comment updated successfully.");
            const fetchedComments = await getCommentsByThread(threadId);
            setComments(sortComments(fetchedComments, sortOrder));
        } catch (error) {
            toast.error("Error updating comment:", error);

        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteCommentFromThread(threadId, commentId);
            const fetchedComments = await getCommentsByThread(threadId);
            setComments(sortComments(fetchedComments, sortOrder));
            toast.success("Comment deleted successfully.");
        } catch (error) {
            toast.error("Error deleting comment:", error);
        }
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    if (!userData) {

        return <p>Loading...</p>;

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
                <div className="commentButtons">
                    <button className="threadButtons" onClick={handleCreateComment}>Comment</button>
                    <div>
                        <button className="threadButtons" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            {showEmojiPicker ? "😜" : "😜"}
                        </button>
                        {showEmojiPicker && (
                            <Picker onEmojiSelect={addEmoji} />
                        )}
                    </div>
                    <br />
                </div>
                <p className="commentsHeader">Comments</p>
                <hr></hr>


                <div>
                    <label htmlFor="sortOrder">Sort by:</label>
                    <select className="threadButtons" id="sortOrder" value={sortOrder} onChange={handleSortChange}>
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
                        isAdmin={userData?.isAdmin}
                    />
                ))}
            </div>

        </div>

    );
}
Comments.propTypes = {
    threadId: PropTypes.string.isRequired,

};


