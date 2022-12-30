import { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons"

// import { ReactComponent as SwordsIcon } from 'icons/swords.svg'
import { ReactComponent as HelmetIcon } from 'icons/helmet-battle.svg'

import CampaignContext from '../CampaignContext.jsx'
import { ref, set, push, getDatabase } from "firebase/database"

import { ChooseRollDice } from './menu/RollDice'
import SpawnEntity from './menu/SpawnEntity.jsx'

import Styles from '../_.module.sass'

export default function DMActions(){

    const campaign = useContext(CampaignContext)
    const { players={} } = campaign;
    
    const [ showRollChooser, setRollChooser ] = useState(false)
    const [ showSpawnEntity, setSpawnEntity ] = useState(false)
    const { id } = useParams()

    return (
        <>
            <div className={Styles.UserActions}>
                {/* <button className="button is-light is-fullwidth" type="button">
                    <span className="icon">
                        <SwordsIcon />
                    </span>
                    <span>Enter Combat</span>
                </button> */}
                <button className="button is-light is-fullwidth" type="button" onClick={() => setSpawnEntity(true)}>
                    <span className="icon">
                        <HelmetIcon />
                    </span>
                    <span>Spawn Entity</span>
                </button>
                <button className="button is-light is-fullwidth" type="button" onClick={() => setRollChooser(true)}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faDiceD20}/>
                    </span>
                    <span>Make Player Roll</span>
                </button>
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

                    let { name, color, image, health, armorClass } = value

                    push(
                        ref(getDatabase(), `campaigns/${id}/players`),
                        {
                            player_name: "NPC",
                            character: {
                                name,
                                image
                            },
                            current: {
                                health,
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