import React from 'react';
import ReactDOM from 'react-dom/client';

// Router
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

// Widgets
import Dashboard from './widget/Dashboard.jsx'

// Pages
import Auth from './pages/Login.jsx'

// Context
import { FirebaseProvider } from './context/Firebase.jsx'

// Stylesheet
import './index.sass'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <FirebaseProvider>
            <BrowserRouter>
                <Routes>
                    { Auth }
                    <Route path="/" element={ <Dashboard /> }>
                        {/* { Campaigns }
                        { Characters } */}
                    </Route>
                    <Route path="*" element={ <Navigate to="/"/> }/>
                </Routes>
            </BrowserRouter>
        </FirebaseProvider>
    </React.StrictMode>
);