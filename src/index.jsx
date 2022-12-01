import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

// Router
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"

// Widgets
import Dashboard from "./widget/Dashboard.jsx"

// Pages
import Auth from "./pages/Auth.jsx"
import Campaigns from "./pages/Campaigns/_all.jsx"
import Characters from "./pages/Characters/_all.jsx"
import Play from './pages/Play/_all.jsx'

// Context
import { FirebaseProvider } from "./context/Firebase.jsx"
import { UserProvider } from "./context/User.jsx"

// Stylesheet
import "./index.sass"

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
    <StrictMode>
        <FirebaseProvider>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        {Auth}
                        <Route path="/" element={<Dashboard />}>
                            { Campaigns  }
                            { Characters }
                        </Route>
                        { Play }
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </FirebaseProvider>
    </StrictMode>,
)
