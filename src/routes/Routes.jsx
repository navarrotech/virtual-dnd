import { BrowserRouter, Routes, Route } from "react-router-dom";

import Authentication, { AuthPage } from './Login'
import Campaigns from './Campaigns'

export default function AppRoutes({ ...props }){

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/"       element={ <AuthPage mode="login"/>  }/>
                { Authentication }
                { Campaigns }
            </Routes>
        </BrowserRouter>
    )

}