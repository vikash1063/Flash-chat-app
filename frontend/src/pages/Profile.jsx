import React, { useState } from 'react';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('../images/img1.jpg');
  const imgLoc = '../images/img1.jpg';
  const {user} = ChatState();
  // console.log(typeof (imageUrl))
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
    setImageUrl(result.data[0].url)
    setGeneratedImage(result.data[0].url)
    console.log(result.data[0].url);
    return result.data[0].url
  };

  async function generateImage() {
    setIsLoading(true);

    try {
      const requestData = {
        prompt: prompt,
        n: 2,
        size: '256x256', // Set the desired image size here
      };

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer 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`,
      };

      const response = await axios.post('https://api.openai.com/v1/images/generations', requestData, {
        headers: headers,
      });

      setGeneratedImage(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start h-screen text-white p-8">
      <div className="mb-8">
        <img
          src={user.pic} /* Add the path to the user's profile picture */
          alt="Profile"
          className="w-32 h-32 rounded-full border-2 border-white"
          onClick={toggleModal}
        />
        {/* {console.log('check')} */}
        {/* Profile Picture Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={toggleModal}>
            <div className="bg-white p-4 rounded-lg">
              <img
                src={require(user.pic)}
                /* Add the path to the user's profile picture */
                alt="Profile"
                className="w-64 h-64 rounded-full"
              />
            </div>
          </div>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">John Doe</h1>
        <p>Email: john@example.com</p>
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
        <form onSubmit={handleSubmit}>
          <label>
            Enter Prompt:
            <input type="text" className="text-gray-950" value={prompt} onChange={handlePromptChange} />
          </label>
          <button type="submit">Generate Image</button>
          <button> </button>
        </form>

        {generatedImage && (
          <div>
            <p>Generated Image:</p>
            <img src={generatedImage.url} alt="Generated" />
          </div>
        )}
        {/* {generatedImage.length > 0 && (
          <div className="mt-4">
            {generatedImage.map((image, index) => (
              <div key={index} className="mt-4">
                <img
                  src={image.url}
                  alt={`generated`}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            ))}
          </div>
        )} */}
        {/* {console.log('reached')} */}
      </div>
    </div>
  );
};

export default Profile;
