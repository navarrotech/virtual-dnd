import { useEffect, useState, useContext, useMemo } from "react"
import { useParams, Navigate } from "react-router-dom"

import UserContext from "../../context/User.jsx"

import { getDatabase, ref, onValue } from "firebase/database"

import Navbar from './components/Navbar.jsx'
import LiveChat from "./components/LiveChat.jsx"
import CharacterPanel from "./components/CharacterPanel.jsx"
import PlayerList from "./components/PlayerList.jsx"
import WelcomeAndJoin from "./components/WelcomeAndJoin.jsx"
// import Map from './components/Map.jsx'

import Loader from "../../common/Loader"

import Styles from './_.module.sass'

import getAPI from './api/_all.js'

export default function Play() {
    const [user] = useContext(UserContext)
    const { id } = useParams()
    const [state, setState] = useState({ loading: true, initialized: false, campaign: {} })
    const api = useMemo(() => { return getAPI(id, user); }, [id, user])
    const database = useMemo(() => getDatabase(), [])

    // Get the data
    useEffect(() => {
        if (!user || !user.uid) { return; }
        // let initialized = false;
        const unsubscribe = onValue(ref(database, "campaigns/" + id), async (snapshot) => {
            console.log("Data syncing...")
            const doc = snapshot.val()
            setState((s) => { return { ...s, loading: false, campaign:{ ...doc, uid:id } } })
        })
        return () => { unsubscribe(); }
    }, [id, user, database])

    // Authentication Check
    if (!user || !user.uid) { console.log('User not found!'); return <Navigate to="/login" replace={false} /> }

    // Loading check
    if (state.loading || !state.campaign || !state.campaign.name) { return <Loader /> }

    // Gather variables
    const { campaign } = state

    // let myPlayerToken = campaign.owner !== user.uid && campaign.players ? campaign.players.find(a => a.player_uid === user.uid) || null : null
    let myPlayerToken = campaign.owner !== user.uid && campaign.players
        ? campaign.players[user.uid] || null
        : null

    if (campaign.owner !== user.uid && (!myPlayerToken || !myPlayerToken.character)) {
        return <WelcomeAndJoin campaign={campaign} api={api} />
    }

    return (
        <div className={Styles.Game}>
            <Navbar campaign={campaign} />
            <PlayerList players={campaign.players} api={api}/>
            <LiveChat chat={campaign.chat} me={user.uid} api={api}/>
            <CharacterPanel player={myPlayerToken} api={api}/>
            {/* <Map map={campaign.map} players={campaign.players} /> */}
        </div>
    )
}
