import { getDatabase, onValue, ref } from 'firebase/database'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from './components/Navbar'

// Context
import { CampaignProvider } from './CampaignContext.jsx'

export default function Wrapper(){
    return <div className={Styles.Game}>
        <CampaignProvider onlyOnce={true}>
            <Navbar />
        </CampaignProvider>
        <ErrorBoundary>
            <ViewCharacter />
        </ErrorBoundary>
    </div>
}

function ViewCharacter(){

    const [ player, setPlayer ] = useState(null)
    const { id, uid } = useParams()

    useEffect(() => {
        const reference = ref(getDatabase(), `/campaigns/${id}/players/${uid}`)
        const unsubscribe = onValue(reference, (snapshot) => { setPlayer(snapshot.val()) })
        return () => { unsubscribe(); }
    }, [ id, uid ])
    
    if(!player || !player.name){ return <Loader /> }

    const { name='' } = player
    return <>
        <h1>Viewing {name}</h1>
    </>
}