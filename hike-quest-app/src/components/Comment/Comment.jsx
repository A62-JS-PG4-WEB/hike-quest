import React, { useState } from 'react';
import PropTypes from 'prop-types';


export default function Comment({ comment, onUpdateComment, onDeleteComment, currentUser }) {
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
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Edit your comment..."
                    />
                    <br />
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        {showEmojiPicker ? "Close Emoji Picker" : "Add Emoji"}
                    </button>
                    {showEmojiPicker && (
                        <Picker onEmojiSelect={addEmoji} />
                    )}
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </>
            ) : (
                <>
                    <p>{comment.text}</p>
                    <small>{comment.author}</small>
                    <p>{new Date(comment.createdOn).toDateString()}</p>
                    {comment.author === currentUser && (
                        <>
                            <button onClick={handleUpdate}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </>
                    )}
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
};