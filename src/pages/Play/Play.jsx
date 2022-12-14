import { useEffect, useState, useContext, useMemo } from "react"
import { useParams, Navigate } from "react-router-dom"

import UserContext from "../../context/User.jsx"

import { getDatabase, ref, onValue } from "firebase/database"

import Navbar from './components/Navbar.jsx'
import LiveChat from "./components/LiveChat.jsx"
import CharacterPanel from "./components/CharacterPanel.jsx"
import PlayerList from "./components/PlayerList.jsx"
import WelcomeAndJoin from "./components/WelcomeAndJoin.jsx"
import UserActions from "./components/UserActions.jsx"
import DMActions from "./components/DMActions.jsx"
import GameState from './components/GameState.jsx'
import Map from './components/Map.jsx'

import Loader from "../../common/Loader"

import Styles from './_.module.sass'

export default function Play() {
    const [user] = useContext(UserContext)
    const { id } = useParams()
    const [state, setState] = useState({
        loading: true,
        initialized: false,
        players: {},
        campaign_name: '',
        campaign_owner: ''
    })
    const [players, setPlayers] = useState(null)
    const database = useMemo(() => getDatabase(), [])

    // Get the data
    useEffect(() => {
        if (!user || !user.uid) { return; }
        // let initialized = false;

        // This updates whenever the players update
        const unsubscribe = onValue(ref(database, "campaigns/" + id + '/players'), async (snapshot) => {
            console.log("Player data syncing...")
            let value = snapshot.val()

            // I want to sort it, so humans are first and NPC's are last.
            try {
                // Deconstruct the object to an array
                let a = Object.keys(value).map(key => {
                    let v = value[key]
                    return { key, isHuman: (v && v.player_name === 'NPC'?1:0) }
                })
                // Sort the array
                a = a.sort((a,b) => {
                    return a.isHuman - b.isHuman
                })
                // Push the sorted indexes into the new object in order
                let b = {}
                a.forEach(k => b[k.key] = { ...value[k.key] })
                // Set the value back
                value = b
            } catch(e){ console.log(e); value = snapshot.val() }
            setPlayers(value)
        })

        onValue(ref(database, "campaigns/" + id), async (snapshot) => {
            const doc = snapshot.val()
            setState((s) => {
                return {
                    ...s,
                    loading: false,
                    campaign_name: doc.name,
                    campaign_owner: doc.owner
                }
            })
        }, { onlyOnce: true })
        return () => { unsubscribe(); }
    }, [id, user, database])

    // Add a class to the body that prevents scroll animations on Chrome
    useEffect(() => {
        document.querySelector('body').classList.add('is-clipped')
        document.querySelector('html').classList.add('is-clipped')
        return () => {
            document.querySelector('body').classList.remove('is-clipped')
            document.querySelector('html').classList.remove('is-clipped')
        }
    })

    // Authentication Check
    if (!user || !user.uid) { console.log('User not found!'); return <Navigate to="/login" replace={false} /> }

    // Loading check
    if (state.loading || !state.campaign_name) { return <Loader /> }

    // let myPlayerToken = campaign.owner !== user.uid && campaign.players ? campaign.players.find(a => a.player_uid === user.uid) || null : null
    let myPlayerToken = state.campaign_owner !== user.uid && players
        ? players[user.uid] || null
        : null

    if (state.campaign_owner !== user.uid && (!myPlayerToken || !myPlayerToken.character)) {
        return <WelcomeAndJoin campaign_name={state.campaign_name}  />
    }

    const isDungeonMaster = state.campaign_owner === user.uid

    return (
        <div className={Styles.Game}>
            <Navbar player={myPlayerToken} campaign_name={state.campaign_name} />
            <Map players={players} isDungeonMaster={isDungeonMaster} />
            { myPlayerToken
                ? <UserActions player={myPlayerToken}  />
                : <DMActions players={players}  />
            }
            <PlayerList players={players} isDungeonMaster={isDungeonMaster} />
            <LiveChat me={user.uid} />
            <CharacterPanel player={myPlayerToken} />
            <GameState players={players} isDungeonMaster={isDungeonMaster}/>
        </div>
    )
}
