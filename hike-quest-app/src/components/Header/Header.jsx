import { NavLink } from 'react-router-dom';
import styles from './Header.module.css'

export default function Header() {
    return (
        <header className={styles.header}>
            <h1 className={styles.heading}>Hike Quest Forum</h1>
            <nav className={styles.navContainer}>
                <div className={styles.navOptions}>
                    <NavLink
                        to="/topics"
                        className={({ isActive }) =>
                            isActive ? `${styles.button} ${styles.active}` : styles.button
                        }
                    >
                        Topics
                    </NavLink>
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            isActive ? `${styles.button} ${styles.active}` : styles.button
                        }
                    >
                        Login
                    </NavLink>
                </div>
            </nav>
        </header>
    );
}

//  <div className="searchContainer">
{/* <input
className="searchBar"
type="text"
placeholder="Search topics..."
/>
</div> */}

