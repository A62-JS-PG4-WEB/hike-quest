import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Account from './views/Account/Account'
import Footer from './views/Footer/Footer'
import MyPosts from './views/MyPosts/MyPosts'
import Topics from './views/Topics/Topics'
import Login from './views/Login/Login'
import Post from './components/Post/Post'
import {AppContext} from '././state/app.context'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react'
import { auth } from './config/firebase-config'
import { getUserData } from './services/users.service'

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

  if (appState.user !== user) {
    setAppState({...appState, user });
  }

  useEffect(() => {
    if (!user) return;
console.log(user, user.id);
    getUserData(appState.user.uid)
      .then(data => {
        const userData = data[Object.keys(data)[0]];
        setAppState({...appState, userData});
      });
  }, [user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <Header />
        <Routes>
          <Route path='/topics' element={<Topics />} />
          <Route path='/account-user' element={<Account />} />
          <Route path='/my-posts' element={<MyPosts />} />
          <Route path='/post' element={<Post />} />
          <Route path='/login' element={!user && <Login />} />

        </Routes>
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>

  )
}


export default App
