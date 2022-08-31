import React from 'react';
import ReactDOM from 'react-dom/client';

import Routes from './routes/Routes';

// Firebase
import firebaseConfig from './firebase.json'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import './index.sass'

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
getAnalytics(firebaseapp);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
        <Routes />
  </React.StrictMode>
);