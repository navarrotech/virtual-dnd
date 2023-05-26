import { createContext, useState, useEffect, useContext } from "react"
import { useParams, Navigate } from "react-router-dom"

import { getDatabase, ref, onValue } from "firebase/database"

import UserContext from 'context/User.jsx'

import WelcomeAndJoin from "./components/WelcomeAndJoin.jsx"
import Loader from "common/Loader.jsx"

const Context = createContext()
export default Context

export function CampaignProvider({ onlyOnce=false, children }) {

    // Router
    const { id } = useParams()
    const [ user ] = useContext(UserContext)

    // State
    const [ campaign, setCampaign ] = useState()
    const [ loading,  setLoading  ] = useState(true)

    // When the user state changes in the cloud, update it here too.
    useEffect(() => {
        if(!user || !user.uid){ return; }
        const database = getDatabase()
        const { uid } = user;
        const unsubscribe = onValue(ref(database, `campaigns/${id}`), async (snapshot) => {
            console.log("Player data syncing...")
            const value = snapshot.val()

            // I want to sort it, so humans are first and NPC's are last.
            let { players } = value
            Object.keys(players).forEach(uid => players[uid].uid = uid)

            // let myPlayerToken = value.owner !== uid && value.players ? campaign.players.find(a => a.player_uid === user.uid) || null : null
            let myCharacter = value.owner !== uid && players
                ? { uid, ...players[uid] } || null
                : null

            let isDungeonMaster = uid === value.owner

            setCampaign({ ...value, myCharacter, isDungeonMaster, myUID: uid })
            setLoading(false)
        }, { onlyOnce })

        return () => { unsubscribe(); }
    }, [id, user, onlyOnce])

    // Authentication Check
    if (!user || !user.uid) { console.log('User not found!'); return <Navigate to="/login" replace={false} /> }

    if(loading){
        return <Loader />
    }

    if (campaign.owner !== user.uid && (!campaign.myCharacter || !campaign.myCharacter.character)) {
        return <WelcomeAndJoin campaign_name={campaign.name}  />
    }

    return <Context.Provider value={campaign}>{children}</Context.Provider>
}
