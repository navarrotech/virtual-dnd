import { useEffect, useState, useContext, useMemo } from "react"
import { useParams, Navigate } from "react-router-dom"

import UserContext from "../../context/User.jsx"

import { getDatabase, ref, onValue } from "firebase/database"

import LiveChat from "./components/LiveChat.jsx"
import CharacterPanel from "./components/CharacterPanel.jsx"
import PlayerList from "./components/PlayerList.jsx"

import Loader from "../../common/Loader"

import Styles from './_.module.sass'

import getAPI from './api/_all.js'

export default function Play() {
    const [user] = useContext(UserContext)
    const { id } = useParams()
    const [state, setState] = useState({ loading: true, campaign: {} })
    const api = useMemo(() => { return getAPI(id, user); }, [id, user])

    // Get the data
    useEffect(() => {
        if (!user || !user.uid) { return; }
        onValue(ref(getDatabase(), "campaigns/" + user.uid + "/" + id), (snapshot) => {
            setState((s) => { return { ...s, loading: false, campaign: snapshot.val() } })
        })
    }, [id, user])

    // Authentication Check
    if (!user || !user.uid) { return <Navigate to="/login" replace={false} /> }

    // Loading check
    if (state.loading || !state.campaign || !state.campaign.name) { return <Loader /> }

    // Gather variables
    const { campaign } = state
    const myCharacter = campaign.find(a => a.player_uid === user.uid)

    api.log()

    return (
        <div className={Styles.Game}>
            <PlayerList players={campaign.players} api={api}/>
            <LiveChat chat={campaign.chat} me={user.username} api={api}/>
            <CharacterPanel myCharacter={myCharacter} api={api}/>
            {/* <Map map={campaign.map}/> */}
        </div>
    )
}
