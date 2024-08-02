import React from 'react';
import styles from './Account.module.css';

const Account = () => {
    return (
        <>
            <div className={styles.name}>
                User: the name
            </div>
            <div className={styles.content}>
                <p>user name:</p>
                <p>e-mail: goshko@coolmail.bg
                    <button className={styles.button}>Edit</button>
                </p>
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
                />
            </div>
        </>
    );
};

export default Account;