import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import UserContext from 'context/User.jsx'

import { onValue, ref, set, getDatabase } from 'firebase/database'

import { RollDice, WaitForRoll, ShowRolledResult } from './status/RollDice.jsx'

export default function GameState({ players, isDungeonMaster=false, ...props }){

    const [ syncedState, setSyncedState ] = useState(null)
    const [ user ] = useContext(UserContext)
    const { id } = useParams()

    useEffect(() => {
        const unsubscribe = onValue(ref(getDatabase(), `/campaigns/${id}/state`), (snapshot) => {
            const value = snapshot.val()
            console.log("New game state: ", value)
            setSyncedState(value)
        });
        return () => {
            unsubscribe();
        }
    }, [id])

    // Loading clause
    if(!syncedState){
        return <></>
    }

    const { action:{ type='' }={ type:'' }, action={ type:'' } } = syncedState;

    if(type === 'rolling'){
        let { who, dice, reason } = action
        if(who === user.uid){
            return <RollDice
                roll={dice}
                check={reason}
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
                isDungeonMaster={isDungeonMaster}
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
            who={players[action.who]}
            roll={action.roll}
            when={action.when}
        />
    }

    // Default
    return <></>
}