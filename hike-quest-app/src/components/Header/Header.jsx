import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Header.module.css'
import { useContext } from 'react';
import { AppContext } from '../../state/app.context';
import { logoutUser } from '../../services/auth.service';

export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';

    const setSearch = (value) => {
        console.log(value);
        setSearchParams({
            search: value,
        });
    }


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
                    <label htmlFor="search"></label>
                    <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br /><br />
                </div>
                {user && (<>
                    <NavLink to="/threads">All Threads</NavLink>
                    <NavLink to="/create-thread">Create Thread</NavLink>
                </>)}
                {!user && <NavLink to="/login">Login</NavLink>}
                {!user && <NavLink to="/register">Register</NavLink>}
                {user && <button onClick={logout}>Logout</button>}
                {user && <p>Welcome, {user.email.slice(0, 5)}</p>}
            </nav>
        </header>
    );
}

