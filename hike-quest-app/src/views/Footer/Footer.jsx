import React from 'react';
import styles from './Footer.module.css';

 export default function Footer () {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <p className={styles.terms}>Terms of use</p>
        <p className={styles.about}>About</p>
      </div>
      <p className={styles.rights}>© 2024 Hike Quest. All rights reserved.</p>
    </footer>
  );
};

