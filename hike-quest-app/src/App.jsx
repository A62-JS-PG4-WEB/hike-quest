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

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

  if (appState.user !== user) {
    setAppState({...appState, user });
  }

  // useEffect(() => {
  //   if (appState.user !== user) {
  //     setAppState(prevState => ({ ...prevState, user }));
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (appState.user !== user) {
  //     setAppState(prevState => ({ ...prevState, user }));
  //   }
  // }, [user, appState]);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const data = await getUserData(user.uid);
        const userData = data[Object.keys(data)[0]];
        setAppState(prevState => ({ ...prevState, userData }));
      } catch (error) {
        console.error('Error fetching user data:', error);
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
        <Routes> 
           {/* <Route path='/' element={!user && < LandingPage/>} /> */}
           <Route path='/'>
            {user ? (
              <Route path='/' element={<Authenticated><AllThreads /></Authenticated>} />
            ) : (
              <Route path='/' element={<LandingPage />} />
            )}
          </Route>
          <Route path='/account-user' element={user && <Authenticated><Account /></Authenticated>} />
          <Route path='/threads' element={<Authenticated><AllThreads /></Authenticated>} />
          <Route path='/threads/:id' element={<Authenticated><SingleThread /></Authenticated>} />
          <Route path='/create-thread' element={<Authenticated><CreateThread /></Authenticated>} />
          <Route path='/login' element={!user && <Login />} />
          <Route path='/register' element={!user && <Register />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;