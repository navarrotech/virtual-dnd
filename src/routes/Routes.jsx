import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

// Routes
import Authentication from './Login'
import Authenticated from "./AuthenticatedWrapper";
import Campaigns from './Campaigns'

export default function AppRoutes({ ...props }){

    return (
        <BrowserRouter>
            <Routes>
                { Authentication }
                <Route path="/" element={ <Authenticated/> }>
                    { Campaigns }
                </Route>
                <Route path="*" element={ <Navigate to="/"/> }/>
            </Routes>
        </BrowserRouter>
    )

}