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
import Map from './components/Map.jsx'

import Loader from "../../common/Loader"

import Styles from './_.module.sass'

import getAPI from './api/_all.js'

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
    const api = useMemo(() => { return getAPI(id, user); }, [id, user])
    const database = useMemo(() => getDatabase(), [])

    // Get the data
    useEffect(() => {
        if (!user || !user.uid) { return; }
        // let initialized = false;

        // This updates whenever the players update
        const unsubscribe = onValue(ref(database, "campaigns/" + id + '/players'), async (snapshot) => {
            console.log("Player data syncing...")
            setPlayers(snapshot.val())
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
        return <WelcomeAndJoin campaign_uid={id} campaign_name={state.campaign_name} api={api} />
    }

    return (
        <div className={Styles.Game}>
            <Navbar player={myPlayerToken} campaign_name={state.campaign_name} />
            <Map players={players} />
            { myPlayerToken
                ? <UserActions player={myPlayerToken} api={api} />
                : <DMActions players={players} api={api} />
            }
            <PlayerList players={players} api={api}/>
            <LiveChat me={user.uid} api={api}/>
            <CharacterPanel player={myPlayerToken} api={api}/>
        </div>
    )
}
