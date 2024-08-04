import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Header.module.css'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../state/app.context';
import { logoutUser } from '../../services/auth.service';
import { getThreadsCount } from '../../services/threads.service';

export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);

    //console.log(user.uid);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const [count, setCount] = useState(null);

    const setSearch = (value) => {
        setSearchParams({
            search: value,
        });
    }

    useEffect(() => {
        getThreadsCount()
            .then(countNew => setCount(countNew))
            .catch(error => alert(error.message));
    }, []);


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
                {user && userData ? (
                    <>
                        <NavLink to="/threads">All Threads</NavLink>
                        <NavLink to="/create-thread">Create Thread</NavLink>
                        <button onClick={logout}>Logout</button>
                        <p>Welcome, {userData.handle}</p>
                        {count !== null && <label>Threads count: {count}</label>}
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login to access</NavLink>
                        <NavLink to="/register">Register</NavLink>
                        <p>Don't miss our pertinent {count} threads!</p>

                    </>
                )}
            </nav>
        </header>
    );
}

