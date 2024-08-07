import PropTypes from 'prop-types';

export default function Comment({ comment }) {

    return (
        <div className="singleComment">
            <p>{comment.text}</p>
            <small>{comment.author}</small>
        </div>
    );
}

Comment.propTypes = {
    comment: PropTypes.shape({
        text: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
    }).isRequired,
};