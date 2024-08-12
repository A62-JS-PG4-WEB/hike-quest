import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Picker from '@emoji-mart/react';

export default function Comment({ comment, onUpdateComment, onDeleteComment, currentUser, isBlocked, isAdmin }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(comment.text);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
                                <p className="userTypeComment">User type: { }</p>
                            </div>
                        </div>
                        <div>
                            <p className='commentCreatedOn'> {new Date(comment.createdOn).toDateString()}</p>
                        </div>



                    </div>
                    <p className="actualComment">{comment.text}</p>
                    <>
                        {(isAdmin || (comment.author === currentUser && !isBlocked)) && (
                            <button className="threadButtons" onClick={handleDelete}>Delete</button>
                        )}
                        {comment.author === currentUser && !isBlocked && (
                            <button className="threadButtons" onClick={handleUpdate}>Edit</button>
                        )}
                    </>
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
};