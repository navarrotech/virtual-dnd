import { useContext } from 'react'
import { useParams } from 'react-router-dom'

import CampaignContext from '../CampaignContext.jsx'

import { ref, set, getDatabase } from 'firebase/database'

import { RollDice, WaitForRoll, ShowRolledResult } from './menu/RollDice.jsx'

export default function GameState(){

    const campaign = useContext(CampaignContext)
    const { players, isDungeonMaster=false, state:syncedState, myUID } = campaign;

    const { id } = useParams()

    // Catch clause
    if(!syncedState){
        return <></>
    }

    const { action:{ type='' }={ type:'' }, action={ type:'' } } = syncedState;

    if(type === 'rolling'){
        let { who, dice, reason } = action
        if(who === myUID){
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