import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from "../../state/app.context";
import { deleteThread, dislikeThread, likeThread } from '../../services/threads.service';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, update } from 'firebase/database';
import UpdateThreadModal from '../UpdateThreadModal/UpdateThreadModal';
import { weatherAPI } from '../../common/constants.js';
import ThumbsUp from '../icons/ThumbsUpOutline.jsx';
import ThumbsUpFilled from '../icons/ThumbsUpFilled.jsx';
import { getUserByHandle } from '../../services/users.service';
import Comment from '../Comment/Comment'; 

export default function Thread({ thread, comments = [] }) { 
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [weatherData, setWeatherData] = useState({});
    const [currentThread, setCurrentThread] = useState(thread);
    const [authorPicUrl, setAuthorPicUrl] = useState('');

    const toggleLike = async () => {
        if (!userData) return;

        const isLiked = thread.likedBy.includes(userData.handle);
        try {
            if (isLiked) {
                await dislikeThread(userData.handle, thread.id);
            } else {
                await likeThread(userData.handle, thread.id);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteThread = async () => {
        if (!userData) return;

        if (thread.author !== userData.handle && !userData.isAdmin) {
            return alert('Not authorized!');
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this thread?");
        if (confirmDelete) {
            try {
                await deleteThread(thread.id);
                alert('Thread deleted successfully.');
                navigate('/threads');
            } catch (error) {
                alert('Failed to delete the thread: ' + error.message);
            }
        }
    };

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const db = getDatabase();
        try {
            await update(ref(db, `threads/${currentThread.id}`), {
                title: currentThread.title,
                content: currentThread.content,
                location: currentThread.location,
            });
            closeModal();
        } catch (error) {
            console.error("Error updating thread: ", error);
        }
    };

    const handleUpdateComment = async (commentId, newText) => {
        console.log(`Updating comment ${commentId} to: ${newText}`);
    };

    const handleDeleteComment = async (commentId) => {
        console.log(`Deleting comment ${commentId}`);
    };

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (!thread.location) return; 

            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${thread.location}&units=metric&appid=${weatherAPI}`
                );
                const data = await response.json();
                setWeatherData(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
    }, [thread.location]);

    useEffect(() => {
        const fetchUserProfilePic = async () => {
            try {
                const user = await getUserByHandle(thread.author);
                setAuthorPicUrl(user.profileImageUrl || 'defaultProfilePicUrl');
            } catch (error) {
                console.error('Error fetching user profile picture:', error);
                setAuthorPicUrl('defaultProfilePicUrl');
            }
        };

        fetchUserProfilePic();
    }, [thread.author]);

    if (!thread) return <p>Loading...</p>; 

    return (
        <div className='threadContainer'>
            <div className='userContainer'>
                <div className='userInfo'>
                    <img
                        src={authorPicUrl}
                        alt="profile-pic"
                        className="profilePic"
                    />
                    <div>
                        <p className='userType'>
                            User type: {userData?.isAdmin ? 'Admin' : 'User'}
                        </p>
                    </div>
                </div>
                <div>
                    {(userData && (thread.author === userData?.handle || userData?.isAdmin)) && (
                        <button className="threadButtons" onClick={handleDeleteThread}>Delete</button>
                    )}
                    {(userData && thread.author === userData?.handle && !userData.isBlocked) && (
                        <button className="threadButtons" onClick={openModal}>Edit</button>
                    )}
                </div>
            </div>
            <p className='threadDate'>{new Date(thread.createdOn).toDateString()}</p>
            <h2 className='threadTitle'>{thread.title}</h2>
            <hr />
            <p className='actualThread'>{thread.content}</p>
            <hr />
            {weatherData?.cod === 200 && (
                <div className='weatherContainer'>
                    <h3>Weather at {thread.location}</h3>
                    <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                        alt="weather-icon"
                    />
                    <p>Temperature: {weatherData.main.temp} °C</p>
                    <p>Wind: {weatherData.wind.speed} m/s</p>
                    <p>Visibility: {weatherData.visibility} m</p>
                </div>
            )}
            <div className='buttonContainer'>
                <button
                    className={`threadButtons ${thread.likedBy.includes(userData?.handle) ? 'like1' : 'like0'}`}
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={toggleLike}
                >
                    {thread.likedBy.includes(userData?.handle) ? <ThumbsUpFilled /> : <ThumbsUp />} {thread.likedBy.length}
                </button>
            </div>
         
            {comments.length > 0 && comments.map(comment => (
                <Comment 
                    key={comment.id}
                    comment={comment}
                    currentUser={userData?.handle || ''}
                    isBlocked={userData?.isBlocked || false}
                    isAdmin={userData?.isAdmin || false}
                    onUpdateComment={handleUpdateComment}
                    onDeleteComment={handleDeleteComment}
                />
            ))}
            <UpdateThreadModal
                show={showModal}
                handleClose={closeModal}
                handleSubmit={handleSubmit}
                thread={currentThread}
                setThread={setCurrentThread}
            />
        </div>
    );
}

Thread.propTypes = {
    thread: PropTypes.shape({
        id: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        createdOn: PropTypes.string.isRequired,
        location: PropTypes.string, 
        likedBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        createdOn: PropTypes.string.isRequired,
    })), 
};

