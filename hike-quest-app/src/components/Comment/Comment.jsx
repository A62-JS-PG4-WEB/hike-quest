import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Picker from '@emoji-mart/react';
import Swal from 'sweetalert2';
import { getUserByHandle } from '../../services/users.service';

/**
 * Comment component that allows users to view, edit, and delete comments.
 * Provides emoji picker functionality for comment editing.
 * 
 * @component
 * 
 * @param {Object} props - The component props
 * @param {Object} props.comment - The comment object
 * @param {string} props.comment.id - The unique ID of the comment
 * @param {string} props.comment.text - The text content of the comment
 * @param {string} props.comment.author - The handle of the comment author
 * @param {string} props.comment.createdOn - The date the comment was created
 * @param {Function} props.onUpdateComment - Function to handle updating a comment
 * @param {Function} props.onDeleteComment - Function to handle deleting a comment
 * @param {string} props.currentUser - The handle of the currently logged-in user
 * @param {boolean} props.isBlocked - Indicates if the current user is blocked
 * @param {boolean} props.isAdmin - Indicates if the current user is an admin
 * 
 * @returns {JSX.Element} The Comment component
 */
export default function Comment({ comment, onUpdateComment, onDeleteComment, currentUser, isBlocked, isAdmin }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(comment.text);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [authorType, setAuthorType] = useState();

    useEffect(() => {
        /**
         * Fetches user information to determine if the author is an admin.
         */
        const userType = async () => {
            try {
                const authorInfo = await getUserByHandle(comment.author);
                setAuthorType(authorInfo.isAdmin);
            } catch (e) {
                // Handle error appropriately
            }
        };

        userType();
    }, [comment.author]);

    /**
     * Toggles the editing state to show or hide the editing controls.
     */
    const handleUpdate = () => {
        setIsEditing(true);
    };

    /**
     * Saves the updated comment text and hides the editing controls.
     */
    const handleSave = () => {
        if (newText.trim() !== comment.text) {
            onUpdateComment(comment.id, newText);
        }
        setIsEditing(false);
    };

    /**
     * Cancels the editing and resets the comment text to its original state.
     */
    const handleCancel = () => {
        setNewText(comment.text);
        setIsEditing(false);
    };

    /**
     * Deletes the comment with confirmation dialog.
     */
    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(99, 236, 112)',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if (result.isConfirmed) {
            onDeleteComment(comment.id);
            Swal.fire({
                title: 'Deleted!',
                text: 'Your comment has been deleted.',
                icon: 'success',
                confirmButtonColor: 'rgb(99, 236, 112)',
            });
        }
    };

    /**
     * Adds an emoji to the current comment text.
     * 
     * @param {Object} emoji - The emoji object selected from the picker
     */
    const addEmoji = (emoji) => {
        setNewText((prevText) => prevText + emoji.native);
    };

    return (
        <div className="singleComment">
            {isEditing ? (
                <>
                    <textarea
                        className='commentBox'
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Edit your comment..."
                    />
                    <br />
                    <button className="threadButtons" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        {showEmojiPicker ? "😜" : "😜"}
                    </button>
                    {showEmojiPicker && (
                        <Picker onEmojiSelect={addEmoji} />
                    )}
                    <button className="threadButtons" onClick={handleSave}>Save</button>
                    <button className="threadButtons" onClick={handleCancel}>Cancel</button>
                </>
            ) : (
                <>
                    <div className="userContainer">
                        <div className='userInfo'>
                            <img
                                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                alt="profile-pic"
                                className="profilePic"
                            />
                            <div>
                                <h3 className="userNameComment">{comment.author}</h3>
                                {(authorType) ?
                                    <p className='userTypeComment'> user type: pro hiker  </p>
                                    :
                                    <p className='userTypeComment'> user type: hiker</p>
                                }
                            </div>
                        </div>
                        <div>
                            <p className='commentCreatedOn'> {new Date(comment.createdOn).toDateString()}</p>
                        </div>
                    </div>
                    <p className="actualComment">{comment.text}</p>
                    <>
                        {comment.author === currentUser && !isBlocked && (
                            <button className="threadButtons" onClick={handleUpdate}>Edit</button>
                        )}
                        {(isAdmin || (comment.author === currentUser && !isBlocked)) && (
                            <button className="threadButtons" onClick={handleDelete}>Delete</button>
                        )}
                    </>
                </>
            )}
        </div>
    );
}

/**
 * Prop types for the Comment component.
 * 
 * @type {Object}
 * @property {Object} comment - The comment object
 * @property {string} comment.id - The unique ID of the comment
 * @property {string} comment.text - The text content of the comment
 * @property {string} comment.author - The handle of the comment author
 * @property {string} comment.createdOn - The date the comment was created
 * @property {Function} onUpdateComment - Function to handle updating a comment
 * @property {Function} onDeleteComment - Function to handle deleting a comment
 * @property {string} currentUser - The handle of the currently logged-in user
 * @property {boolean} isBlocked - Indicates if the current user is blocked
 * @property {boolean} isAdmin - Indicates if the current user is an admin
 */
Comment.propTypes = {
    comment: PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        createdOn: PropTypes.string.isRequired,
    }).isRequired,
    onUpdateComment: PropTypes.func.isRequired,
    onDeleteComment: PropTypes.func.isRequired,
    currentUser: PropTypes.string.isRequired,
    isBlocked: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
};
