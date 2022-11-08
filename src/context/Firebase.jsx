import { createContext, useState } from "react"
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getDatabase } from "firebase/database"

const config = {
    apiKey: "AIzaSyCzdOBWa4Pt5KXE2q9O5ZEIFp6HWMC6XMY",
    authDomain: "dnd-virtual.firebaseapp.com",
    databaseURL: "https://dnd-virtual-default-rtdb.firebaseio.com",
    projectId: "dnd-virtual",
    storageBucket: "dnd-virtual.appspot.com",
    messagingSenderId: "413243210236",
    appId: "1:413243210236:web:ec0bf380d28ef709131a79",
    measurementId: "G-DN8H9WN9N8",
}

const app = initializeApp(config)
const analytics = getAnalytics(app)
const database = getDatabase(app)

const Context = createContext()

export default Context

export function FirebaseProvider({ children }) {
    // We use state to prevent code from looping
    const [state] = useState({
        app,
        config,
        analytics,
        database,
    })
    return <Context.Provider value={state}>{children}</Context.Provider>
}
