import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { ChooseRollDice } from '../Modals/RollDice.jsx'
import SpawnEntity from '../components/menu/SpawnEntity.jsx'

import Styles from '../_.module.sass'

export default function DMActions(){

    const [ showRollChooser, setRollChooser ] = useState(false)
    const [ showSpawnEntity, setSpawnEntity ] = useState(false)
    const { id } = useParams()

    return (
        <>
            <div className={Styles.UserActions}>
            </div>
            {
                showRollChooser
                ? <ChooseRollDice players={players} onChosen={(value) => {
                    setRollChooser(false)
                    if(!value){ return; }

                    set(
                        ref(getDatabase(), `campaigns/${id}/state/action`),
                        { type: 'rolling', ...value }
                    )
                }}/>
                : <></>
            }
            {
                showSpawnEntity
                ? <SpawnEntity onFinish={(value) => {
                    setSpawnEntity(false)
                    if(!value){ return; }

                    let { name, class:_class='', race='', color, image, health, armorClass } = value

                    push(
                        ref(getDatabase(), `campaigns/${id}/players`),
                        {
                            player_name: "NPC",
                            character: {
                                name,
                                features:{
                                    class:_class,
                                    race
                                },
                                image
                            },
                            current: {
                                hidden: true,
                                health,
                                maxHealth: 30,
                                armorClass
                            }
                        }
                    )
                    .then(function({ key }){
                        set(
                            ref(getDatabase(), `campaigns/${id}/map/entities/${key}`),
                            { x: 50, y: 50, color }
                        )
                    })
                }}/>
                : <></>
            }
        </>
    )

}
