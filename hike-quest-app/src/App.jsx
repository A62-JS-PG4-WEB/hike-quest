import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Account from './views/Account/Account';
import Footer from './views/Footer/Footer';
import AllThreads from './views/AllThreads/AllThreads';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import { AppContext } from './state/app.context';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { auth } from './config/firebase-config';
import { getUserData } from './services/users.service';
import CreateThread from './views/CreateThread/CreateThread';
import SingleThread from './views/SingleThread/SingleThread';
import NotFound from './views/NotFound/NotFound';
import Authenticated from './hoc/Authenticated';
import LandingPage from './views/LandingPage/LandingPage';
import AdminPanel from './components/AdminPanel/AdminPanel';
import NotAuthorized from './views/NotAuthorized/NotAuthorized';
import Terms from './views/Terms/Terms';
import TagPosts from './views/TagPosts/TagPosts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import About from './views/About/About';

/**
 * Main application component that handles routing and authentication.
 *
 * @component
 * @description 
 * The `App` component is the root of the application. It uses `react-router-dom` to define various routes for the application. 
 * It manages user authentication state with Firebase and provides context for user data throughout the application.
 * 
 * It includes:
 * - Header and Footer components
 * - Routes for different pages including account management, threads, and authentication
 * - Conditional rendering based on user authentication status
 * 
 * @returns {JSX.Element} The root component of the application with routing and context provider.
 */
function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

  if (appState.user !== user) {
    setAppState({ ...appState, user });
  }

  /**
   * Effect hook that updates `appState`.
   * 
   * @async
   * @function
   * @name useEffect
   * @param {Array} dependencies - List of dependencies that trigger the effect. In this case, `[user]`.
   */
    useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const data = await getUserData(user.uid);
        const userData = data[Object.keys(data)[0]];
        setAppState(prevState => ({ ...prevState, userData }));
      } catch (error) {
        toast.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <Header />
        <ToastContainer stacked closeOnClick />


        <Routes>
          <Route path='/'>
            {user ? (
              <Route path='/' element={<Authenticated><AllThreads /></Authenticated>} />
            ) : (
              <Route path='/' element={<LandingPage />} />
            )}
          </Route>
          <Route path='/admin' element={appState.userData?.isAdmin ? <AdminPanel /> : <NotFound />} />
          <Route path='/account-user' element={user && <Authenticated><Account /></Authenticated>} />
          <Route path='/threads' element={<Authenticated><AllThreads /></Authenticated>} />
          <Route path='/threads/:id' element={<Authenticated><SingleThread /></Authenticated>} />
          <Route path='/tag-posts/:id' element={<Authenticated><TagPosts /></Authenticated>} />
          <Route path='/create-thread' element={<Authenticated>{!appState.userData?.isBlocked ? <CreateThread /> : <NotAuthorized />}</Authenticated>} />
          <Route path='/search-results' element={<Authenticated><AllThreads /></Authenticated>} />
          <Route path='/login' element={!user && <Login />} />
          <Route path='/register' element={!user && <Register />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;