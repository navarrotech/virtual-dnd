import { createContext, useState, useEffect } from "react"
import { getSession } from "../api.js"
import Loader from "../common/Loader.jsx"

const Context = createContext()

export default Context

export function UserProvider({ children }) {
    const [user, setUser] = useState(null)

    // When the user state changes in the cloud, update it here too.
    useEffect(() => {
        getSession().then(({ data }) => {
            if (data && typeof data === "object" && Object.keys(data).length) {
                return setUser(data)
            }
            return setUser(false)
        })
    }, [])

    if (user === null) {
        return <Loader />
    }

    return <Context.Provider value={[user, setUser]}>{children}</Context.Provider>
}
