import { createContext, useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Loader from "../common/Loader.jsx"

const Context = createContext()

export default Context

export function UserProvider({ children }) {
    const [state, setState] = useState({
        loading: true,
        user: [null, () => {}],
    })

    // When the user state changes in the cloud, update it here too.
    useEffect(() => {
        function setSubstate(newState) {
            setState((oldState) => {
                return { ...oldState, loading: false, user: [newState, setSubstate] }
            })
        }
        onAuthStateChanged(getAuth(), (user) => {
            setSubstate(user)
        })
    }, [])

    if (state.loading) {
        return <Loader />
    }

    return <Context.Provider value={state.user}>{children}</Context.Provider>
}
