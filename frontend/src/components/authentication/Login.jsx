import React, { useState, useEffect } from 'react'
import FormField from '../FormField'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  var v;

  const navigate = useNavigate();
  // const { setUser } = ChatState();

  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  const handleCredentialResponse = (response) => {
    // console.log(Response)

    console.log(JSON.stringify(parseJwt(response.credential)));
    v = (parseJwt(response.credential))
    console.log(v.email)
    setEmail((v.email))
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      toast.warning("Please Fill all the Fields", {
        autoClose: 5000,
        position: 'bottom-center'
      });
      console.log("warning")
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email },
        config
      );

      toast.success("Registration successfull", {
        autoClose: 5000,
        position: 'bottom-center'
      });
      console.log("successs")
      // setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate('/auth/chat');
    } catch (error) {
      toast.error("Error Occured!", {
        data: error.response.data.message,
        autoClose: 5000,
        position: 'bottom-center'
      });
      setLoading(false);
      console.log("error", error)
    }
  };
  return (
    <div>
      <form className='w-full mt-[65px] flex flex-col gap-[30px]'>
        <div>
          <GoogleLogin

            onSuccess={(Response) => {
              console.log(Response);
              // setData(Response)
              handleCredentialResponse(Response)

            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>

        {email && <div>
          <h2>connected to email</h2>
          <input
            type="submit"
            className={"font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071] cursor-pointer"}
            value="Login"
            onClick={submitHandler}
          />
        </div>}
        <ToastContainer />
      </form>
    </div>
  )
}

export default Login