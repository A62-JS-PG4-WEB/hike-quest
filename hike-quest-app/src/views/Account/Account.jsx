import React, { useContext, useState } from 'react';
import styles from './Account.module.css';
import { AppContext } from '../../state/app.context';
import { updateAccountInfoDB } from '../../services/users.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Account() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [editing, setEditing] = useState(false);
    const [newEmail, setNewEmail] = useState(userData ? userData.email : '');
    const [newFirstName, setNewFirstName] = useState(userData ? userData.firstName : '');
    const [newLastName, setNewLastName] = useState(userData ? userData.lastName : '');

    if (!user || !userData) {
        return <p>Loading...</p>;
    }

    const handleEmailChange = (e) => setNewEmail(e.target.value);
    const handleFirstNameChange = (e) => setNewFirstName(e.target.value);
    const handleLastNameChange = (e) => setNewLastName(e.target.value);

    const saveChanges = async () => {
        try {

            await updateAccountInfoDB(userData.handle, newEmail, newFirstName, newLastName);
            setAppState((prevState) => ({
                ...prevState,
                userData: {
                    ...prevState.userData,
                    email: newEmail,
                    firstName: newFirstName,
                    lastName: newLastName
                }
            }));
            setEditing(false);
            toast.success('Account details updated successfully.');
        } catch (error) {
            toast.error('Failed to update account details: ' + error.message);
        }
    };

    return (
        <>
            <div className={styles.name}>My account</div>
            <div className={styles.content}>
                <p>User name: {userData.handle}</p>
                <p>First name: {editing ? (
                    <input
                        type="text"
                        value={newFirstName}
                        onChange={handleFirstNameChange}
                    />
                ) : (
                    userData.firstName
                )}</p>
                <p>Last name: {editing ? (
                    <input
                        type="text"
                        value={newLastName}
                        onChange={handleLastNameChange}
                    />
                ) : (
                    userData.lastName
                )}</p>
                <p>Email: {editing ? (
                    <input
                        type="email"
                        value={newEmail}
                        onChange={handleEmailChange}
                    />
                ) : (
                    userData.email
                )}
                </p>
                <button
                    className={styles.button}
                    onClick={() => setEditing(!editing)}
                >
                    {editing ? 'Cancel' : 'Edit'}
                </button>
                {editing && (
                    <button
                        className={styles.button}
                        onClick={saveChanges}
                    >
                        Save
                    </button>
                )}
            </div>
        </>
    );
}
