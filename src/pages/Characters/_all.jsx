import { Route } from "react-router-dom"

import ViewAll from "./ViewAll.jsx"
import ViewOne from "./ViewOne.jsx"

export default (
    <>
        <Route to="/characters" element={<ViewAll />} />
        <Route to="/character/:id" element={<ViewOne />} />
    </>
)
