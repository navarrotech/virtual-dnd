import { createContext } from "react"
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

const value = {
    app,
    config,
    analytics,
    database,
}

const Context = createContext()

export default Context

export function FirebaseProvider({ children }) {
    return <Context.Provider value={value}>{children}</Context.Provider>
}
