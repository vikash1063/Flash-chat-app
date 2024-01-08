import "./App.css"
import React from 'react'
import {Route, Routes} from "react-router-dom";
import Home from './pages/Home';
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Chat from './pages/Chat';

const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
     
        <Routes>
          <Route path="/"element={<Home/>}/>
          <Route path='/auth/profile' element={<Profile/>}/>
          <Route path='/auth' element={<Auth/>} />
          <Route path='/auth/chat' element={<Chat/>} />

        </Routes>
      
    </div>
  )
}

export default App