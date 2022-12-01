import { useEffect, useState, useContext, useMemo } from "react"
import { useParams, Navigate } from "react-router-dom"

import UserContext from "../../context/User.jsx"

import { getDatabase, ref, onValue } from "firebase/database"

import Navbar from './components/Navbar.jsx'
import LiveChat from "./components/LiveChat.jsx"
import CharacterPanel from "./components/CharacterPanel.jsx"
import PlayerList from "./components/PlayerList.jsx"
import WelcomeAndJoin from "./components/WelcomeAndJoin.jsx"

import Loader from "../../common/Loader"

import Styles from './_.module.sass'

import getAPI from './api/_all.js'

export default function Play() {
    const [user] = useContext(UserContext)
    const { id, useruid:owneruid } = useParams()
    const [state, setState] = useState({ loading: true, initialized: false, campaign: {} })
    const api = useMemo(() => { return getAPI(id, user); }, [id, user])
    const database = useMemo(() => getDatabase(), [])

    // Get the data
    useEffect(() => {
        if (!user || !user.uid) { return; }
        // let initialized = false;
        const unsubscribe = onValue(ref(database, "campaigns/" + owneruid + "/" + id), async (snapshot) => {
            console.log("Fetching value!")
            const doc = snapshot.val()
            setState((s) => { return { ...s, loading: false, campaign:{ ...doc, uid:id } } })
        })
        return () => { unsubscribe(); }
    }, [id, user, owneruid, database])

    // Authentication Check
    if (!user || !user.uid) { return <Navigate to="/login" replace={false} /> }

    // Loading check
    if (state.loading || !state.campaign || !state.campaign.name) { return <Loader /> }

    // Gather variables
    const { campaign } = state
    let myPlayerToken = campaign.players.find(a => a.player_uid === user.uid) || null

    if (!myPlayerToken || !myPlayerToken.character) {
        return <WelcomeAndJoin campaign={campaign} api={api} owneruid={owneruid} />
    }

    return (
        <div className={Styles.Game}>
            <Navbar campaign={campaign} />
            <PlayerList players={campaign.players} api={api}/>
            <LiveChat chat={campaign.chat} me={user.username} api={api}/>
            <CharacterPanel myCharacter={myPlayerToken.character} api={api}/>
            {/* <Map map={campaign.map}/> */}
        </div>
    )
}
