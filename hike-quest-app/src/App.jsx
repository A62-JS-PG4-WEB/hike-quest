import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Account from './views/Account/Account'
import Footer from './views/Footer/Footer'
import AllThreads from './views/AllThreads/AllThreads'
import Login from './views/Login/Login'
import Register from './views/Register/Register'
import { AppContext } from '././state/app.context'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react'
import { auth } from './config/firebase-config'
import { getUserData } from './services/users.service'
import CreateThread from './views/CreateThread/CreateThread'
import SingleThread from './views/SingleThread/SingleThread'

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

  if (appState.user !== user) {
    setAppState({ ...appState, user });
  }

  useEffect(() => {
    if (!user) return;

    console.log(user, user.id);

    getUserData(appState.user.uid)
      .then(data => {
        const userData = data[Object.keys(data)[0]];
        setAppState({ ...appState, userData });
      });
  }, [user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <Header />
        <Routes>

          <Route path='/account-user' element={<Account />} />
          <Route path='/threads' element={<AllThreads />} />
          <Route path='/threads/:id' element={<SingleThread />} />
          <Route path='/create-thread' element={<CreateThread />} />
          <Route path='/login' element={!user && <Login />} />
          <Route path='/register' element={!user && <Register />} />

        </Routes>
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>

  )
}


export default App
