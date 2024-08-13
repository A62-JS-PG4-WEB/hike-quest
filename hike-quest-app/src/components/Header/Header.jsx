import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import styles from'./Header.module.css';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../state/app.context';
import { logoutUser } from '../../services/auth.service';
import { getThreadsCount, getUsersCount, subscribeToThreadChanges } from '../../services/threads.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileIcon from '../../components/icons/ProfileIcon';

export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const [count, setCount] = useState(null);
    const [usersCount, setUsersCount] = useState(null)
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    const setSearch = (value) => {
        setSearchParams({
            search: value,

        });
        navigate(`/search-results?search=${value}`);

    }

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const users = await getUsersCount();
                setUsersCount(users);

                const countNew = await getThreadsCount();
                setCount(countNew);
            } catch (error) {
                toast.error(error.message);
            }
        };
        fetchCounts();
        const unsubscribe = subscribeToThreadChanges(newCount => {
            setCount(newCount);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        toast.success('Successfully logged out');
        navigate('/');
    };

    const toggleProfilePopup = () => {
        setShowProfilePopup(!showProfilePopup);
    };

    return (
        <header className={styles.header}>
            <div className='logoContainer'>
                <a className='aLogo' href="/">
                    <img
                        src="https://cdn.discordapp.com/attachments/1260151938750742622/1272199714909065216/9_-removebg-preview_3.png?ex=66bb6d50&is=66ba1bd0&hm=98f03080f4a466d39920b2a41d292a189aa68e9e797dcfaa9ea3f117522693cb&"
                        alt="Logo"
                        className="logoPicture"
                    />
                </a>
            </div>

            <nav>
                <input
                    className="searchContainer"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search threads"
                />
                <br />
                <br />
                {!user ? (<>
                    <div className='navLabels'>
                        <div className='navThreadsCount'>
                            <p className='threadsCountText'>Don't miss our threads! </p>
                            <p className='threadsCount'>{count}</p>
                        </div>
                        <div className='navAccountCount'>
                            <p className='accountCountText'>Total hikers active</p>
                            <p className='accountUserCount'>{usersCount}</p>
                        </div>
                    </div>
                </>
                )
                    :
                    (<>
                        <div className='navLabels'>
                            <div className='navThreadsCount'>
                                <p className='threadsCountText'>Threads published </p>
                                <p className='threadsCount'>{count}</p>
                            </div>
                            <div className='navAccountCount'>
                                <p className='accountCountText'>Active hikers</p>
                                <p className='accountUserCount'>{usersCount}</p>
                            </div>
                        </div>
                    </>
                    )}
                {!user && <NavLink className="navlink" to="/login">Login to access</NavLink>}
                {!user && <NavLink className="navlink" to="/register">Register</NavLink>}

                {user && <p>Welcome, {userData?.firstName}</p>}
                <button 
                            onClick={toggleProfilePopup}
                            className={styles.navButton}
                        >
                          <ProfileIcon />
                        </button>
//                 {{user && <button onClick={logout}>Logout</button>}}

                {user && (
                    <>
                        
                        {showProfilePopup && (
                            <div className={styles.profilePopup}>
                                <button
                                    onClick={() => navigate('/account-user')}
                                    className={styles.account}
                                >
                                    Edit Account
                                </button>
                                {userData?.isAdmin && (
                                    <button
                                        className={styles.admin}
                                        onClick={() => navigate('/admin')}
                                    >
                                        Admin Panel
                                    </button>
                                )}
                                <button
                                    onClick={logout}
                                    className={styles.logoutButton}
                                >
                                    Logout
                                </button>
                                <button
                                    onClick={toggleProfilePopup}
                                    className={styles.closeButton}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </>
                )}
            </nav>
        </header>
    );
};

