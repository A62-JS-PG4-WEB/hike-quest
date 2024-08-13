import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Picker from '@emoji-mart/react';
import { AppContext } from '../../state/app.context';
import { getUserByHandle } from '../../services/users.service';

export default function Comment({ comment, onUpdateComment, onDeleteComment, currentUser, isBlocked, isAdmin }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(comment.text);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState('');

    const handleUpdate = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        if (newText.trim() !== comment.text) {
            onUpdateComment(comment.id, newText);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setNewText(comment.text);
        setIsEditing(false);
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if (confirmDelete) {
            onDeleteComment(comment.id);
        }
    };

    const addEmoji = (emoji) => {
        setNewText((prevText) => prevText + emoji.native);
    };

    useEffect(() => {
        const fetchUserProfilePic = async () => {
            try {
                const user = await getUserByHandle(comment.author);
                setProfilePicUrl(user.profileImageUrl || 'defaultProfilePicUrl');
            } catch (error) {
                console.error('Error fetching user profile picture:', error);
                setProfilePicUrl('defaultProfilePicUrl');
            }
        };

        fetchUserProfilePic();
    }, [comment.author]);

    return (
        <div className="singleComment">
            {isEditing ? (
                <>
                    <textarea
                        className="commentBox"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Edit your comment..."
                    />
                    <br />
                    <button className="threadButtons" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        {showEmojiPicker ? "Hide Emoji Picker" : "Show Emoji Picker"}
                    </button>
                    {showEmojiPicker && (
                        <Picker onEmojiSelect={addEmoji} />
                    )}
                    <button className="threadButtons" onClick={handleSave}>Save</button>
                    <button className="threadButtons" onClick={handleCancel}>Cancel</button>
                </>
            ) : (
                <>
                    <div>
                        <img src={profilePicUrl} alt="Profile" className="profilePic" />
                    </div>
                    <h3 className="userNameComment">{comment.author}</h3>
                    <p className="userTypeComment">User type: {isAdmin ? 'Admin' : 'User'}</p>
                    <p className="commentCreatedOn">{new Date(comment.createdOn).toDateString()}</p>
                    <p className="actualComment">{comment.text}</p>
                    <div>
                        {comment.author === currentUser && !isBlocked && (
                            <button className="threadButtons" onClick={handleUpdate}>Edit</button>
                        )}
                        {(isAdmin || (comment.author === currentUser && !isBlocked)) && (
                            <button className="threadButtons" onClick={handleDelete}>Delete</button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

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