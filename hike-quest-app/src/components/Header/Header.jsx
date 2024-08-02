import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css'
import { useContext } from 'react';
import { AppContext } from '../../state/app.context';
import { logoutUser } from '../../services/auth.service';

export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/login');
    };

    return (
        <header>
            <h1>Hike Quest Forum</h1>
            <nav >
                <div className="searchContainer">
                    <input
                        className="searchBar"
                        type="text"
                        placeholder="Search topics..."
                    />
                </div>
                {user && (<>
                    <NavLink to="/topics">Topics</NavLink>
                    <NavLink to="/thread-create">Create thread</NavLink>
                </>)}
                {!user && <NavLink to="/login">Login</NavLink>}
                {!user && <NavLink to="/register">Register</NavLink>}
                {user && <button onClick={logout}>Logout</button>}
                {user && <p>Welcome, {user.name}</p>}
            </nav>
        </header>
    );
}

