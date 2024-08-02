import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Account from './views/Account/Account'
import Footer from './views/Footer/Footer'
import MyPosts from './views/MyPosts/MyPosts'
import Topics from './views/Topics/Topics'
import Login from './views/Login/Login'
import {AppContext} from '././state/app.context'
import { useState } from 'react'

function App() {
  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ user, setUser }}>
        <Header />
        <Routes>
          <Route path='/topics' element={<Topics />} />
          <Route path='/account-user' element={<Account />} />
          <Route path='/my-posts' element={<MyPosts />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>

  )
}

export default App
