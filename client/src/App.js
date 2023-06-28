import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from './context/AppContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import UserAuth from './components/UserAuth';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Shorts from './components/Shorts';

function App() {

  const { user, setUser, logged, setLogged } = useContext(AppContext)

  useEffect(() => {
    if (localStorage.getItem("logged") !== null) {
      setLogged(JSON.parse(localStorage.getItem("logged")))
    }

    if (localStorage.getItem("userData") !== null) {
      setUser(JSON.parse(localStorage.getItem("userData")))
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path='/' element={logged ? <Home /> : <UserAuth />}>
          <Route path='/' element={<Feed />}></Route>
          <Route path='/shorts' element={<Shorts />}></Route>
          <Route path='/friends' element={"friends"}></Route>
          <Route path='/:userParam' element={<Profile />}></Route>
          <Route path='/hashtags/:hashtag' element={"hashtag"}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App;
