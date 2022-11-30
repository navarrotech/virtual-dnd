import { Route } from "react-router-dom"

import Play from "./Play.jsx"

export default (
    <>
        <Route to="/play/:id" element={<Play />} />
    </>
)
