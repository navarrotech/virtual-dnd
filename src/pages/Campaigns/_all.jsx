import { Route } from "react-router-dom"

import ViewAll from "./ViewAll.jsx"
import ViewOne from "./ViewOne.jsx"

export default (
    <>
        <Route path="/campaigns" element={<ViewAll />} />
        <Route path="/campaigns/:id" element={<ViewOne />} />
    </>
)
