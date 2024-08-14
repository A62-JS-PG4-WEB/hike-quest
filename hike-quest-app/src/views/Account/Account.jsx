import React, { useContext, useState } from 'react';
import styles from './Account.module.css';
import { AppContext } from '../../state/app.context';
import { updateAccountInfoDB, updateUserEmail } from '../../services/users.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Account component allows users to view and update their account details such as 
 * email, first name, and last name. 
 * 
 * @component
 * @example
 * // Example usage:
 * // <Account />
 * 
 * @returns {JSX.Element} The Account component
 */
export default function Account() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [editing, setEditing] = useState(false);
    const [newEmail, setNewEmail] = useState(userData ? userData.email : '');
    const [newFirstName, setNewFirstName] = useState(userData ? userData.firstName : '');
    const [newLastName, setNewLastName] = useState(userData ? userData.lastName : '');
    const [currentPassword, setCurrentPassword] = useState('');

    if (!user || !userData) {
        return <p>Loading...</p>;
    }

    /**
     * Handles changes to the email input field.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handleEmailChange = (e) => setNewEmail(e.target.value);

    /**
     * Handles changes to the first name input field.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handleFirstNameChange = (e) => setNewFirstName(e.target.value);

    /**
     * Handles changes to the last name input field.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handleLastNameChange = (e) => setNewLastName(e.target.value);

    /**
     * Handles changes to the current password input field.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handlePasswordChange = (e) => setCurrentPassword(e.target.value);

    /**
     * Saves the changes made to the account details. Updates the account information
     * in the database and updates the user's state. If the email is changed, it also
     * updates the user's email in the authentication service.
     * 
     * @async
     */
    const saveChanges = async () => {
        try {
            await updateAccountInfoDB(userData.handle, newEmail, newFirstName, newLastName);

            if (newEmail !== userData.email) {
                await updateUserEmail(newEmail, currentPassword);
            }


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
            <div className={styles.container}>
                <h1 className={styles.title}>My Account</h1>
                <div className={styles.content}>
                    <div className={styles.infoGroup}>
                        <p className={styles.label}>Username:</p>
                        <p className={styles.value}>{userData.handle}</p>
                    </div>
                    <div className={styles.infoGroup}>
                        <p className={styles.label}>First Name:</p>
                        <p className={styles.value}>
                            {editing ? (
                                <input
                                    type="text"
                                    value={newFirstName}
                                    onChange={handleFirstNameChange}
                                    className={styles.input}
                                />
                            ) : (
                                userData.firstName
                            )}
                        </p>
                    </div>
                    <div className={styles.infoGroup}>
                        <p className={styles.label}>Last Name:</p>
                        <p className={styles.value}>
                            {editing ? (
                                <input
                                    type="text"
                                    value={newLastName}
                                    onChange={handleLastNameChange}
                                    className={styles.input}
                                />
                            ) : (
                                userData.lastName
                            )}
                        </p>
                    </div>
                    <div className={styles.infoGroup}>
                        <p className={styles.label}>Email:</p>
                        <p className={styles.value}>
                            {editing ? (
                                <>
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={handleEmailChange}
                                        className={styles.input}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Current password"
                                        value={currentPassword}
                                        onChange={handlePasswordChange}
                                        className={styles.input}
                                    />
                                </>
                            ) : (
                                userData.email
                            )}
                        </p>
                    </div>
                    <div className={styles.buttons}>
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
                </div>
            </div>
            <ToastContainer />
        </>
    )
}