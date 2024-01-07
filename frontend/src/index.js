import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="412366728381-bus9ojgkuev734ckit700vst1vfvaola.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </BrowserRouter>

);
