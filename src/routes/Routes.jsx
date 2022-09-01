import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

// Routes
import Authentication from './Login'
import Authenticated from "./AuthenticatedWrapper";

import Campaigns from './Campaigns'
import Characters from './Characters'
import Settings from './Settings'

export default function AppRoutes({ ...props }){

    return (
        <BrowserRouter>
            <Routes>
                { Authentication }
                <Route path="/" element={ <Authenticated/> }>
                    { Campaigns }
                    { Characters }
                    { Settings }
                </Route>
                <Route path="*" element={ <Navigate to="/"/> }/>
            </Routes>
        </BrowserRouter>
    )

}