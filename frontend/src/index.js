
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App'; // Your App component
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './components/context/AuthContext';
// need to wrap it round the app for it to work


ReactDOM.render(
  <BrowserRouter> {/* Wrap your app in BrowserRouter */}
  <AuthProvider>
    <App />
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
