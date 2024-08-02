import { NavLink } from 'react-router-dom';
import styles from './Header.module.css'
import { useContext } from 'react';
import { AppContext } from '../../state/app.context';

export default function Header() {
    const {} = useContext(AppContext)
    return (
        <header>
            <h1>Hike Quest Forum</h1>
            <nav >
                <NavLink to="/topics">Topics</NavLink>
                <NavLink to="/login">Login</NavLink>
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

