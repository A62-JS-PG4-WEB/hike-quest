import React, { useContext, useState } from 'react';
import styles from './Account.module.css';
import { AppContext } from '../../state/app.context';
import { updateEmailDB, updateEmailInAuth } from '../../services/users.service';


export default function Account() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [editingEmail, setEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState(userData ? userData.email : '');

    if (!user || !userData) {
        return <p>Loading...</p>;
    };



    const handleEmailChange = (e) => {
        setNewEmail(e.target.value);
    };

    const saveNewEmail = async () => {
        try {
            await updateEmailInAuth(newEmail);

            await updateEmailDB(userData.handle, newEmail);
            setAppState((prevState) => ({
                ...prevState,
                userData: { ...prevState.userData, email: newEmail }
            }));
            // console.log(user.email);
            setEditingEmail(false);
            alert('Email updated successfully.');
        } catch (error) {
            alert('Failed to update email: ' + error.message);
        }
    };


    return (
        <>
            <div className={styles.name}> My account </div>
            <div className={styles.content}>
                <p>User name: {userData.handle}</p>
                <p>First name: {userData.firstName}</p>
                <p>Last name: {userData.lastName}</p>
                <p>Email: {editingEmail ? (
                    <input
                        type="email"
                        value={newEmail}
                        onChange={handleEmailChange}
                    />
                ) : (
                    userData.email
                )}
                    <button
                        className={styles.button}
                        onClick={() => setEditingEmail(!editingEmail)}
                    >
                        {editingEmail ? 'Cancel' : 'Edit'}
                    </button>
                    {editingEmail && (
                        <button
                            className={styles.button}
                            onClick={saveNewEmail}
                        >
                            Save
                        </button>
                    )}           </p>
                {/* 
                <p>role:</p>
            </div>
            <div className={styles.description}>
                <div className={styles.header}>
                    <p className={styles.about}>About me</p>
                    <button className={styles.button}>Edit</button>
                </div>
                <input
                    type="text"
                    className={styles.input}
                    defaultValue="Tell us more about you ..."
                /> */}
            </div>
        </>
    );
};

