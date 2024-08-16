import React from 'react';
import styles from './Footer.module.css';
import { useNavigate } from 'react-router-dom';

/**
 * Footer component displays the footer section of the website, including
 * links to the Terms of Use and About pages, as well as a copyright notice.
 *
 * @component
 * 
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
   * Handles navigation to About page.
   * @function
   */
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <button className={styles.footerButton} onClick={() => handleNavigate('/terms')}>Terms of Use</button>
        <p className={styles.rights}>© 2024 Hike Quest. All rights reserved.</p>
        <button className={styles.footerButton} onClick={() => handleNavigate('/about')}>About</button>
      </div>
    </footer>

  );
}