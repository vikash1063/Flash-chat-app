import React, { useState, useEffect } from 'react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
  const [isSignup, setIsSignup] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  const navigate = useNavigate()

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("userInfo"))
  //   if (user) navigate("/chat")
  // }, [])

  const showSignup = () => {
    setIsSignup(true)
    setIsLogin(false)
  }

  const showLogin = () => {
    setIsLogin(true)
    setIsSignup(false)
  }

  return (
    <div className="flex flex-col max-sm:w-full max-w-[680px] mx-auto sm:pr-5 pt-10">
      {/* Toggle Buttons */}
      <div className="flex justify-around p-4 sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        {isSignup ? (
          <button
            className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] bg-[#6f6f78] text-white px-10 rounded-lg"
            onClick={showSignup}
          >
            Signup
          </button>
        ) : (
          <button
            className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] bg-[#39393e] text-white px-10 rounded-lg"
            onClick={showSignup}
          >
            Signup
          </button>
        )}

        {isLogin ? (
          <button
            className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] bg-[#6f6f78] text-white px-10 rounded-lg"
            onClick={showLogin}
          >
            Login
          </button>
        ) : (
          <button
            className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] bg-[#39393e] text-white px-10 rounded-lg"
            onClick={showLogin}
          >
            Login
          </button>
        )}
      </div>

      {/* Form Section */}
      <div className="flex justify-around p-4 sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] m-10">
        {isSignup && <Signup />}
        {isLogin && <Login />}
      </div>
    </div>
  )
}

export default Auth
