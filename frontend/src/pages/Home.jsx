import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col justify-center text-center items-center h-screen absolute inset-0 backdrop-filter backdrop-blur-md bg-opacity-50">
      <div className="text-center mb-8 ">
        <h1 className="text-5xl font-bold text-white mb-8">Flash⚡</h1>
        <p className="text-blue-100 items-center text-xl">Flash is a versatile chat app that can be used for both professional and personal purposes. It is an integration of cutting-edge features with ease of use to create a perfect amalgamation for a meticulous software.
        Chat with your friends seamlessly using variety of features including voice to text feature. Customise your profile Display picture using AI.</p>
      </div>
      <div className="get-started items-center">
        <Link to="/auth" className="inline-block bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">Login/Signup</Link>
      </div>
    </div>
  );
}

export default Home;
