import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import UserContext from 'context/User.jsx'

import { onValue, ref, set, getDatabase } from 'firebase/database'

import { RollDice, WaitForRoll, ShowRolledResult } from './status/RollDice.jsx'

export default function GameState({ players, dungeonMaster, ...props }){

    const [ syncedState, setSyncedState ] = useState(null)
    const [ user ] = useContext(UserContext)
    const { id } = useParams()

    useEffect(() => {
        onValue(ref(`/campaigns/${id}/state`), function(snapshot){
            const value = snapshot.val()
            setSyncedState(value)
        })
    }, [id])

    // Loading clause
    if(!syncedState || !syncedState.phase){
        return <></>
    }

    const { actions:{ type='' }={ type:'' }, actions={ type:'' } } = syncedState;

    if(type === 'rolling'){
        let { who, dice, check } = actions
        if(who === user.uid){
            return <RollDice
                roll={dice}
                check={check}
                onRolled={(roll) => {
                    set(
                        ref(getDatabase(), `campaigns/${id}/state/action`),
                        {
                            type: 'rolled',
                            when: new Date().toISOString(),
                            who,
                            roll
                        }
                    )
                }}
            />
        }
        else {
            return <WaitForRoll
                who={players[who]}
                isDungeonMaster={who === dungeonMaster}
                onStop={() => {
                    set(
                        ref(getDatabase(), `campaigns/${id}/state/action`),
                        { type: '' }
                    )
                }}
            />
        }
    }

    if(type === 'rolled'){
        // This has a built in timer of 10 seconds, and then it will stop showing! Even after refresh :)
        return <ShowRolledResult
            who={players[actions.who]}
            roll={actions.roll}
            when={actions.when}
        />
    }

    // Default
    return <></>
}