import React, {useState, useEffect} from 'react'
import FormField from '../FormField'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";


const Signup = () => {


  const navigate = useNavigate();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  // const [data,setData] = useState();
  var v;

  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  const handleCredentialResponse =  (response) => {
    // console.log(Response)

    console.log(JSON.stringify(parseJwt(response.credential)));
    v = (parseJwt(response.credential))
    console.log(v.email)
    setEmail((v.email))
  }

  const demo = () => {
    console.log(email, name, phone)

    
  }
  

  const submitHandler = async (e) => {
    e.preventDefault()
    console.log(email.stringify)
    console.log(name.type)


    setLoading(true);
    if (!name || !email || !phone ) {
      
      toast.warning("Please Fill all the Fields", {
        autoClose: 5000,
        position: 'bottom-center'
      });
      console.log("warning")

      setLoading(false);
      return;
    }
    
    console.log(name, email, phone, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          phone,
          pic,
        },
        config
      );
      console.log(data);
      
      toast.success("Registration successfull", {
        autoClose: 5000,
        position: 'bottom-center'
      });
      console.log("successs")
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

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      // toast({
      //   title: "Please Select an Image!",
      //   status: "warning",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
      toast.warning("Please Select an Image!", {
        autoClose: 5000,
        position: 'bottom-center'
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "seemern");
      fetch("https://api.cloudinary.com/v1_1/dkymcjwej/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast.warning("Please Select an Image!", {
        autoClose: 5000,
        position: 'bottom-center'
      });
      setLoading(false);
      return;
    }
  };
  // useEffect(() => {
  //   // handleCredentialResponse();
  //   console.log(data)
  //   if (data) {
  //     // v = (parseJwt(data.credential))
  //     // console.log(v.email)
  //     // setEmail(v.email)
  //     // submitHandler()
  //     handleCredentialResponse();

  //   }
  // }, [data]);
  return (
    <div>
      <form className='w-full mt-[65px] flex flex-col gap-[30px]'>

        <FormField
          labelName="Name"
          placeHolder="Enter your Name"
          inputType="string"
          handleChange={(e) => setName(e.target.value)}

        />


        {/* <FormField
          labelName="Email"
          placeHolder="Enter your Email address"
          inputType="email"
          handleChange={(e) => setEmail(e.target.value)}

        /> */}

        <FormField
          labelName="Phone Number"
          placeHolder="Enter your ph. no."
          inputType="tel"
          handleChange={(e) => setPhone(e.target.value)}

        />
        

        <label className="flex-1 w-full flex flex-col">

          <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">Upload Your Picture</span>

          <input
            type="file"
            accept='image/*'
            className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#8f939f] rounded-[10px] sm:min-w-[300px]"
            onChange={(e) => postDetails(e.target.files[0])}
          />

        </label>

        {/* {loading && <input
          type="submit"
          className={"font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071] cursor-pointer"}
          value="Loading..."
          // onClick={submitHandler}
        />}
        {!loading && <input
          type="submit"
          className={"font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071] cursor-pointer"}
          value="Sign Up"
          onClick={submitHandler}
        />} */}

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
          <h2 className='text-white'>connected to email</h2>
          <input
            type="submit"
            className={"font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071] cursor-pointer mt-3"}
            value="Sign Up"
            onClick={submitHandler}
          />
          </div>}
          <ToastContainer/>

      </form>
    </div>
  )
}

export default Signup