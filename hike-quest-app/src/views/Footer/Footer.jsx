import React from 'react';
import styles from './Footer.module.css';
import { useNavigate } from 'react-router-dom';

 export default function Footer () {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/terms');
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <p className={styles.terms}>
          <button onClick={handleNavigate}> Terms of use</button>
          </p>
        <p className={styles.about}>About</p>
      </div>
      <p className={styles.rights}>© 2024 Hike Quest. All rights reserved.</p>
    </footer>
  );
};

