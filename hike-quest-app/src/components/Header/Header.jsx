import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Header.module.css';
import { AppContext } from '../../state/app.context';
import { logoutUser } from '../../services/auth.service';
import { getThreadsCount, getUsersCount, subscribeToThreadChanges } from '../../services/threads.service';
import { updateProfilePicture, updateProfileImageInDB, updateUserProfile } from '../../services/users.service';

export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const [count, setCount] = useState(null);
    const [usersCount, setUsersCount] = useState(null);
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [editableUserData, setEditableUserData] = useState({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || ''
    });
    const [editing, setEditing] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Update fields with userData
    useEffect(() => {
        setEditableUserData({
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            email: userData?.email || ''
        });
    }, [userData]);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const users = await getUsersCount();
                setUsersCount(users);

                const countNew = await getThreadsCount();
                setCount(countNew);
            } catch (error) {
                alert(error.message);
            }
        };
        fetchCounts();
        const unsubscribe = subscribeToThreadChanges(newCount => {
            setCount(newCount);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/login');
    };

    const handleProfilePicChange = (event) => {
        setNewProfilePic(event.target.files[0]);
    };

    const saveProfilePic = async () => {
        if (newProfilePic) {
            try {
                const imageUrl = await updateProfilePicture(user.uid, newProfilePic);
                await updateProfileImageInDB(user.uid, imageUrl);

                setAppState((prevState) => ({
                    ...prevState,
                    userData: {
                        ...prevState.userData,
                        profileImageUrl: imageUrl,
                    },
                }));

                alert('Profile picture updated successfully!');
            } catch (error) {
                console.error('Error updating profile picture:', error);
                alert('Failed to update profile picture.');
            }
        }
    };

    const saveProfileInfo = async () => {
        try {
            let currentPassword = '';
            if (editableUserData.email !== user.email) {
                currentPassword = password;
                if (!currentPassword) {
                    throw new Error('Current password is required for email update');
                }
            }

            if (newPassword && newPassword !== confirmPassword) {
                throw new Error('New password and confirmation do not match');
            }

            // Update only the current user's data
            await updateUserProfile(user.uid, editableUserData, currentPassword, newPassword);

            setAppState((prevState) => ({
                ...prevState,
                userData: {
                    ...prevState.userData,
                    ...editableUserData,
                }
            }));

            alert('Profile info updated successfully!');
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile info:', error);
            alert('Failed to update profile info.');
        }
    };

    const closeProfilePopup = () => {
        setShowProfilePopup(false);
    };

    return (
        <header className={styles.header}>
            <h1>Hike Quest Forum</h1>
            <nav>
                <div className={styles.searchContainer}>
                    <input
                        value={search}
                        onChange={e => setSearchParams({ search: e.target.value })}
                        type="text"
                        placeholder="Search..."
                    />
                </div>
                <label>Total hikers: {usersCount}</label>
                {!user && <label>Don't miss our {count} threads!</label>}
                {user && (
                    <div className={styles.navButtons}>
                        <NavLink to="/threads" className={styles.navButton}>All Threads</NavLink>
                        {!userData?.isBlocked && (
                            <NavLink to="/create-thread" className={styles.navButton}>Create Thread</NavLink>
                        )}
                        <button
                            onClick={() => setShowProfilePopup(!showProfilePopup)}
                            className={styles.navButton}
                        >
                            Profile
                        </button>
                    </div>
                )}
                {!user && <NavLink to="/login" className={styles.navButton}>Login</NavLink>}
                {!user && <NavLink to="/register" className={styles.navButton}>Register</NavLink>}
    
                {user && showProfilePopup && (
                    <div className={styles.profilePopup}>
                        <h3>Edit Profile</h3>
                        <img
                            src={userData?.profileImageUrl || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                            alt="Profile"
                            className={styles.profilePicPopup}
                        />
                        <input
                            type="file"
                            onChange={handleProfilePicChange}
                        />
                        <button
                            onClick={saveProfilePic}
                            className={styles.saveButton}
                        >
                            Save Picture
                        </button>
                        <p>User name: {userData.handle}</p>
                        <p>First name: {editing ? (
                            <input
                                type="text"
                                value={editableUserData.firstName}
                                onChange={(e) => setEditableUserData((prevState) => ({ ...prevState, firstName: e.target.value }))}
                            />
                        ) : (
                            userData.firstName
                        )}</p>
                        <p>Last name: {editing ? (
                            <input
                                type="text"
                                value={editableUserData.lastName}
                                onChange={(e) => setEditableUserData((prevState) => ({ ...prevState, lastName: e.target.value }))}
                            />
                        ) : (
                            userData.lastName
                        )}</p>
                        <p>Email: {editing ? (
                            <>
                                <input
                                    type="email"
                                    value={editableUserData.email}
                                    onChange={(e) => setEditableUserData((prevState) => ({ ...prevState, email: e.target.value }))}
                                />
                                <input
                                    type="password"
                                    placeholder="Current password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </>
                        ) : (
                            userData.email
                        )}
                        </p>
                        {editing && (
                            <>
                                <p>New password: 
                                    <input
                                        type="password"
                                        placeholder="New password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </p>
                                <p>Confirm new password:
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </p>
                            </>
                        )}
                        <button
                            className={styles.button}
                            onClick={() => setEditing(!editing)}
                        >
                            {editing ? 'Cancel' : 'Edit'}
                        </button>
                        {editing && (
                            <button
                                className={styles.button}
                                onClick={saveProfileInfo}
                            >
                                Save
                            </button>
                        )}
                        <button
                            onClick={logout}
                            className={styles.logoutButton}
                        >
                            Logout
                        </button>
                        <button
                            onClick={closeProfilePopup}
                            className={styles.closeButton}
                        >
                            Close
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}