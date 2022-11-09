import React from 'react';
import ReactDOM from 'react-dom/client';

// Tools
import axios from 'axios'

// Router
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

// Widgets
import Dashboard from './widget/Dashboard.jsx'

// Pages
import Auth from './pages/Auth.jsx'

// Context
import { FirebaseProvider } from './context/Firebase.jsx'
import { UserProvider } from './context/User.jsx'

// Stylesheet
import './index.sass'

axios.defaults.baseURL = process.env.REACT_APP_API
axios.defaults.crossDomain = true
axios.defaults.withCredentials = true
axios.defaults.responseType = "json"

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <FirebaseProvider>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        { Auth }
                        <Route path="/" element={ <Dashboard /> }>
                            {/* { Campaigns }
                            { Characters } */}
                            <Route path="/dashboard" element={<h1>Hello World!</h1> } />
                        </Route>
                        <Route path="*" element={ <Navigate to="/"/> }/>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </FirebaseProvider>
</React.StrictMode>
);
