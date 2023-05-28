
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

// Outlets
import Dashboard from "./core/Dashboard";

// Routes
import Authentication from './routes/Auth'

import AllCharacters from './routes/Characters/list'
import EditCharacter from './routes/Characters/edit'
import CharacterStats from './routes/Characters/EditorPages/Stats'
import CharacterAppearance from './routes/Characters/EditorPages/Appearance'
import CharacterSpells from './routes/Characters/EditorPages/Spells'

// import Campaigns from "./routes/Campaigns/_all.jsx"
// import Characters from "./routes/Characters/_all.jsx"
// import Play from './routes/Play/_all.jsx'

export default function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                { Authentication }
                <Route path="/" element={<Dashboard />}>

                {/* Campaigns */}
                <Route path="/campaigns" element={<h1>Welcome to campaigns!</h1>} />

                {/* Characters */}
                <Route path="/characters" element={<AllCharacters />} />
                <Route path="/characters/:id" element={<EditCharacter />}>
                    <Route path="/characters/:id/stats"      element={<CharacterStats      />} />
                    <Route path="/characters/:id/appearance" element={<CharacterAppearance />} />
                    <Route path="/characters/:id/spells"     element={<CharacterSpells     />} />
                </Route>

                </Route>
                <Route path="*" element={ <Navigate to="/"/> }/>
            </Routes>
        </BrowserRouter>
    )
}
