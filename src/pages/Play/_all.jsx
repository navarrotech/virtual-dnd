import { Route } from "react-router-dom"

import Play from "./Play.jsx"

export default (
    <>
        <Route path="/play/:id" element={<Play />} />
    </>
)
