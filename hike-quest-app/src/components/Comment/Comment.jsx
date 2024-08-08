import PropTypes from 'prop-types';
import '../../views/SingleThread/SingleThread.css'

export default function Comment({ comment }) {

    return (
        <>

            <div className="singleComment">
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
                        <p className='commentCreatedOn'> {new Date(comment.createdOn).toLocaleDateString()}</p>
                    </div>



                </div>
                <p className="actualComment">{comment.text}</p>
            </div>



        </>
    )
}

Comment.propTypes = {
    comment: PropTypes.shape({
        text: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        createdOn: PropTypes.string.isRequired,
    }).isRequired,
};