import React from 'react';
import styles from './Footer.module.css';
import { useNavigate } from 'react-router-dom';

/**
 * Footer component displays the footer section of the website, including
 * links to the Terms of Use and About pages, as well as a copyright notice.
 *
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 *
 * @returns {JSX.Element} The rendered Footer component.
 */
export default function Footer() {
  const navigate = useNavigate();

  /**
   * Handles navigation to the Terms of Use page.
   *
   * @function
   */
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

