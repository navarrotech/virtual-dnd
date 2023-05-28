
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

import AllCampaigns from './routes/Campaigns/list'
import EditCampaign from './routes/Campaigns/edit'

// import Play from './routes/Play/_all.jsx'

export default function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                { Authentication }
                <Route path="/" element={<Dashboard />}>

                    {/* Campaigns */}
                    <Route path="/campaigns" element={<AllCampaigns />} />
                    <Route path="/campaigns/:id" element={<EditCampaign />}/>

                    {/* Characters */}
                    <Route path="/characters" element={<AllCharacters />} />
                    <Route path="/characters/:id" element={<EditCharacter />}>
                        <Route path="/characters/:id/stats"      element={<CharacterStats      />} />
                        <Route path="/characters/:id/appearance" element={<CharacterAppearance />} />
                        <Route path="/characters/:id/spells"     element={<CharacterSpells     />} />
                    </Route>

                </Route>
                <Route path="*" element={ <Navigate to="/campaigns"/> }/>
            </Routes>
        </BrowserRouter>
    )
}
