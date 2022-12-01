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
    const [state, setState] = useState({ loading: true, initialized: false, campaign: {} })
    const api = useMemo(() => { return getAPI(id, user); }, [id, user])

    // Get the data
    useEffect(() => {
        if (!user || !user.uid) { return; }
        // let initialized = false;
        onValue(ref(getDatabase(), "campaigns/" + user.uid + "/" + id), async (snapshot) => {
            const doc = snapshot.val()
            setState((s) => { return { ...s, loading: false, campaign: doc } })

            // if (initialized) { return } initialized = true;

            // console.log("Pulling character data...")

            // const characters = doc.players.map((player) => player.character_uid).filter((a) => a != null)
            // const promises = []

            // characters.forEach(uid => {
            //     promises.push(new Promise(acc => {
            //         onValue(ref(getDatabase(), "/characters/" + uid), (snapshot) => {
            //             const val = snapshot.val()
            //             acc({ uid, ...val })
            //         }, { onlyOnce: true })
            //     }))
            // })
            
            // const character_data = await Promise.all(promises)
            // characters.forEach(uid => {
            //     let index = doc.players.findIndex(a => a.character_uid === uid)
            //     if (index === -1) { return console.log('Character to link not found in master doc'); }
            //     doc.players[index].character = character_data.find(a => a.uid === uid)
            // })

            // setState((s) => { return { ...s, initialized: true, campaign:doc } })
        })
    }, [id, user])

    // Authentication Check
    if (!user || !user.uid) { return <Navigate to="/login" replace={false} /> }

    // Loading check
    if (state.loading || !state.campaign || !state.campaign.name) { return <Loader /> }

    // Gather variables
    const { campaign } = state
    const myCharacter = campaign.players.find(a => a.player_uid === user.uid).character || {}

    return (
        <div className={Styles.Game}>
            <PlayerList players={campaign.players} api={api}/>
            <LiveChat chat={campaign.chat} me={user.username} api={api}/>
            <CharacterPanel myCharacter={myCharacter} api={api}/>
            {/* <Map map={campaign.map}/> */}
        </div>
    )
}
