import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

// Routes
import Authentication from './Login'
import Authenticated from "./AuthenticatedWrapper";

import Campaigns from './Campaigns'
import Characters from './Characters'

export default function AppRoutes({ ...props }){

    return (
        <BrowserRouter>
            <Routes>
                { Authentication }
                <Route path="/" element={ <Authenticated/> }>
                    { Campaigns }
                    { Characters }
                </Route>
                <Route path="*" element={ <Navigate to="/"/> }/>
            </Routes>
        </BrowserRouter>
    )

}