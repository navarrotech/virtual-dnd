import { createContext, useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

const Context = createContext()

export default Context

export function UserProvider({ children }) {
    const [user, setUser] = useState({})

    // When the user state changes in the cloud, update it here too.
    useEffect(() => {
        onAuthStateChanged(getAuth(), (u) => setUser(u))
    }, [])

    return <Context.Provider value={user}>{children}</Context.Provider>
}
