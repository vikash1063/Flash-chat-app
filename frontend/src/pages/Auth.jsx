import React, { useState, useEffect } from 'react'
import Login from '../components/authentication/Login'
import Signin from '../components/authentication/Signin'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
    const [isSignin, setIsSignin] = useState(true);
    const [ isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (user) navigate.push("/chats");
    }, []);

    const handleSignin = () => {
        setIsSignin(true);
        setIsLogin(false);
    }

    const handleLogin = () => {
        setIsLogin(true);
        setIsSignin(false);
    }
    return (
        <div className='flex flex-col max-sm:w-full max-w-[680px] mx-auto sm:pr-5 pt-10' >
            <div className="flex justify-around p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                {isSignin && <button className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px]  bg-[#6f6f78] text-white px-10 rounded-lg " onClick={handleSignin}>Signin</button>}
                {!isSignin && <button className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] bg-[#39393e]text-white px-10 rounded-lg" onClick={handleSignin}>Signin</button> }
                {isLogin && <button className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] bg-[#6f6f78] text-white px-10 rounded-lg " onClick={handleLogin}>Login</button>}
                {!isLogin && <button className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] bg-[#39393e]text-white px-10 rounded-lg " onClick={handleLogin}>Login</button>}
            </div>
            <div className="flex justify-around p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] m-10">
                {isSignin &&  <Signin/>}
               
                {isLogin && <Login/>}
                
            </div>

           
        </div>
    )
}

export default Auth