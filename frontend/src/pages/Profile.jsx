import React, { useState } from 'react';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import { useToast } from "@chakra-ui/react";
import { Navigate, useNavigate } from 'react-router-dom';

const OPENAI_API_KEY = "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"; // Replace with your actual API key

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [imageUrl, setImageUrl] = useState('../images/img1.jpg');
  // const imgLoc = '../images/img1.jpg';
  const {user, setUser} = ChatState();
  // console.log(typeof (imageUrl))
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState();
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const toast = useToast();
  const navigate = useNavigate();
   console.log(user?.pic) 
  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Call the OpenAI API with the prompt
    const generatedImageUrl = await callOpenAPI(prompt);

    // Update the state with the generated image URL
    setGeneratedImage(generatedImageUrl);
  };

  const callOpenAPI = async (userPrompt) => {
    const prompt = userPrompt;
    // try {
    // Make a request to the OpenAI API (Note: Replace 'YOUR_API_KEY' with your actual OpenAI API key)
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
      },
      body: JSON.stringify({
        prompt,
        n: 1, // Adjust as needed
        size: "1024x1024",
      }),
    });

    const result = await response.json();
    // setImageUrl(result.data[0].url)
    setGeneratedImage(result.data[0].url)
    console.log(result.data[0].url);
    return result.data[0].url
  };

  async function generateImages() {
    setIsLoading(true);

    try {
      console.log(prompt)
      const requestData = {
        prompt: prompt,
        n: 2,
        size: "256x256", // Set the desired image size here
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      };

      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        requestData,
        {
          headers: headers,
        }
      );

      setGeneratedImages(response.data.data);
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const backHandler = () =>{
    navigate("/auth/chat")
  }

  const handleChangePic = async (imageUrl) => {
    

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
       const data = await axios.put(
        `/api/user/changePic`,
        {
          userId: user?._id,
          pic: imageUrl,
        },
        config
        );
        console.log(data)

        await setUser(data?.data);
        // window.location.reload(false);
      toast({
        title: "Profile pic updated",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="flex flex-col mx-auto items-start h-screen text-white p-8 bg-black ">
      <div className="mb-8 flex flex-row space-x-80">
        <img
          src={user?.pic} /* Add the path to the user's profile picture */
          alt="Profile"
          className="w-32 h-32 rounded-full border-2 border-white"
          onClick={toggleModal}
        />
        <div className="cursor-pointer hover:to-blue-300" 
        onClick={backHandler}>
          chat page
        </div>
        {/* {console.log('check')} */}
        {/* Profile Picture Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={toggleModal}>
            <div className="bg-white p-4 rounded-lg">
              <img
                src={user?.pic}
                
                /* Add the path to the user's profile picture */
                alt="Profile"
                className="w-64 h-64 rounded-full"
              />
            </div>
          </div>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
        <p>Email: {user?.email}</p>
        <p>Phone: +123 456 7890</p>
        <div className="mt-4">
          <p className="text-lg font-semibold mb-2">About Me:</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae elit vitae urna hendrerit
            vehicula vel in nulla.
          </p>
        </div>
      </div>
      <div>
        <form>
          <label>
            Enter Prompt:
            <input type="text" className="text-gray-950" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </label>
          <button
            onClick={generateImages}
            disabled={isLoading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isLoading ? "Generating..." : "Generate Images"}
          </button>
        </form>

        
        {generatedImages.length > 0 && (
          <div className="mt-4 flex flex-row gap-9">
            {generatedImages.map((image, index) => (
              <div key={index} className="mt-4">
                <img className='cursor-pointer'
                  src={image.url}
                  alt={`generated`}
                  style={{ maxWidth: '100%', height: 'auto' }}
                  onClick={() => handleChangePic(image.url)}
                />
              </div>
            ))}
          </div>
        )}
        {/* {console.log('reached')} */}
      </div>
    </div>
  );
};

export default Profile;
