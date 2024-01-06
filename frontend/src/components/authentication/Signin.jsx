import React, {useState} from 'react'
import FormField from '../FormField'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { useNavigate } from "react-router";

const Signin = () => {


  const navigate = useNavigate();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      
      toast.warning("Please Fill all the Fields", {
        autoClose: 5000,
        position: 'bottom-center'
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast.warning("Passwords do not match", {
        autoClose: 5000,
        position: 'bottom-center'
      });
      return;
    }
    console.log(name, email, password, pic);
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
          password,
          pic,
        },
        config
      );
      console.log(data);
      
      toast.success("Registration successfull", {
        autoClose: 5000,
        position: 'bottom-center'
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate.push("/chats");
    } catch (error) {
      toast.error("Error Occured!", {
        data: error.response.data.message,
        autoClose: 5000,
        position: 'bottom-center'
      });
      setLoading(false);
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
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
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
  return (
    <div>
      <form className='w-full mt-[65px] flex flex-col gap-[30px]'>

        <FormField
          labelName="Name"
          placeHolder="Enter your Name"
          inputType="string"
          handleChange={(e) => setName(e.target.value)}

        />


        <FormField
          labelName="Email"
          placeHolder="Enter your Email address"
          inputType="email"
          handleChange={(e) => setEmail(e.target.value)}

        />

        <FormField
          labelName="Password"
          placeHolder="Enter your Password"
          inputType="password"
          handleChange={(e) => setPassword(e.target.value)}

        />
        <FormField
          labelName="Confirm Password"
          placeHolder="Confirm Password"
          inputType="password"
          handleChange={(e) => setConfirmpassword(e.target.value)}

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


        <input
          type="submit"
          className={"font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071] cursor-pointer"}
          value="Sign Up"
          onClick={submitHandler}
          isLoading={loading}
        />

      </form>
    </div>
  )
}

export default Signin