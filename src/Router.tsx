// Pages
// import Auth from "./routes/Auth.jsx"
// import Campaigns from "./routes/Campaigns/_all.jsx"
// import Characters from "./routes/Characters/_all.jsx"
// import Play from './routes/Play/_all.jsx'

// function Router() {
//   return <BrowserRouter>
//     <Routes>
//       {Auth}
//           {/* { Play } */}
//       <Route path="/login" element={<h1>Login</h1>} index />
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   </BrowserRouter>
// }

// export default Router

import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Dashboard from "./core/Dashboard";

// Routes
import Authentication from './routes/Auth'

// import Campaigns from './Campaigns'
// import Characters from './Characters'

export default function AppRoutes(){

    return (
        <BrowserRouter>
            <Routes>
                { Authentication }
                <Route path="/" element={<Dashboard />}>
                  <Route path="/campaigns" element={<h1>Welcome to campaigns!</h1>} />
                  <Route path="/test" element={<h1>Welcome to test!</h1>} />
                </Route>
                    {/* { Campaigns }
                    { Characters } */}
                <Route path="*" element={ <CatchAll /> }/>
            </Routes>
        </BrowserRouter>
    )
}

function CatchAll(){
    console.log("404: Redirecting to /")
    return <Navigate to="/"/>
}
