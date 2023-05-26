import { Route } from "react-router-dom"

import AllCharacters from "./ViewAll.jsx"
import EditCharacter from "./ViewOne.jsx"

export default (
    <>
        <Route path="/characters" element={<AllCharacters />} />
        <Route path="/characters/:id" element={<EditCharacter />} />
    </>
)
