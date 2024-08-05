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
    const [count, setCount] = useState(0);

    const setSearch = (value) => {

        setSearchParams({
            search: value,

        });

    }

    useEffect(() => {
        getThreadsCount()
            .then(countNew => setCount(countNew))
            .catch(error => alert(error.message));

    }, 0);


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
                {!user && <label> Don't miss our pertinent {count} threads! </label>}
                {user && (<>
                    <NavLink to="/threads">All Threads</NavLink>
                    <NavLink to="/create-thread">Create Thread</NavLink>
                </>)}
                {!user && <NavLink to="/login">Login to access</NavLink>}
                {!user && <NavLink to="/register">Register</NavLink>}
                {user && <button onClick={logout}>Logout</button>}
                {userData && <p>Welcome, {userData.firstName}</p>}
                {user && <label> Thanks for contributing threads {count} </label>}
            </nav>
        </header>
    );
}

