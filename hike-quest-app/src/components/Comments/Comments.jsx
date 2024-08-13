import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
import { AppContext } from "../../state/app.context";
import { addCommentToThread, getCommentsByThread, updateCommentInThread, deleteCommentFromThread } from "../../services/threads.service";
import Comment from "../Comment/Comment";
import '../../views/SingleThread/SingleThread.css';
import Picker from '@emoji-mart/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Comments component displays and manages comments for a specific thread.
 * Allows users to add, update, delete, and sort comments.
 * 
 * @component
 * 
 * @param {Object} props - The component props
 * @param {string} props.threadId - The unique ID of the thread to which comments are associated
 * 
 * @returns {JSX.Element} The Comments component
 */
export default function Comments({ threadId }) {
  const { userData } = useContext(AppContext);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    /**
     * Fetches comments for the specified thread and sorts them based on the current sort order.
     */
    const fetchComments = async () => {
      const fetchedComments = await getCommentsByThread(threadId);
      setComments(sortComments(fetchedComments, sortOrder));
    };

    fetchComments();
  }, [threadId, sortOrder]);

  /**
   * Sorts comments based on the specified order.
   * 
   * @param {Array} comments - The array of comments to be sorted
   * @param {string} order - The sort order ('newest' or 'oldest')
   * @returns {Array} The sorted array of comments
   */
  const sortComments = (comments, order) => {
    return comments.sort((a, b) => {
      if (order === 'newest') {
        return new Date(b.createdOn) - new Date(a.createdOn);
      } else {
        return new Date(a.createdOn) - new Date(b.createdOn);
      }
    });
  };

  /**
   * Updates the comment state as the user types.
   * 
   * @param {Object} e - The event object from the textarea input
   */
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  /**
   * Adds an emoji to the current comment text.
   * 
   * @param {Object} emoji - The emoji object selected from the picker
   */
  const addEmoji = (emoji) => {
    setComment((prevComment) => prevComment + emoji.native);
  };

  /**
   * Creates a new comment and updates the comments list.
   * Displays success or error toast notifications based on the outcome.
   */
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

  /**
   * Updates an existing comment and refreshes the comments list.
   * Displays success or error toast notifications based on the outcome.
   * 
   * @param {string} commentId - The ID of the comment to update
   * @param {string} updatedText - The new text content for the comment
   */
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

  /**
   * Deletes a comment and updates the comments list.
   * Displays success or error toast notifications based on the outcome.
   * 
   * @param {string} commentId - The ID of the comment to delete
   */
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

  /**
   * Updates the sort order for comments.
   * 
   * @param {Object} e - The event object from the select input
   */
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {!userData.isBlocked && (
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
            <button className="threadButtons" onClick={handleCreateComment}>
              Comment
            </button>
            <div>
              <button
                className="threadButtons"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {showEmojiPicker ? "😜" : "😜"}
              </button>
              {showEmojiPicker && (
                <Picker onEmojiSelect={addEmoji} />
              )}
            </div>
            <br />
          </div>
        </div>
      )}
      <p className="commentsHeader">Comments</p>
      <hr />
      <div>
        <label htmlFor="sortOrder">Sort by:</label>
        <select
          className="threadButtons"
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortChange}
        >
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
      <ToastContainer />
    </div>
  );
}

/**
 * Prop types for the Comments component.
 * 
 * @type {Object}
 * @property {string} threadId - The unique ID of the thread to which comments are associated
 */
Comments.propTypes = {
  threadId: PropTypes.string.isRequired,
};
