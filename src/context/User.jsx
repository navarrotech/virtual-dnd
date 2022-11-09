import { createContext, useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

import axios from "axios"

const Context = createContext()

export default Context

export function UserProvider({ children }) {
    const [user, setUser] = useState({})

    // When the user state changes in the cloud, update it here too.
    useEffect(() => {
        onAuthStateChanged(getAuth(), (u) => setUser(u))
    }, [])

    return <Context.Provider value={[user, setUser]}>{children}</Context.Provider>
}
