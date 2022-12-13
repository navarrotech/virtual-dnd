import { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { ReactComponent as SwordsIcon } from 'icons/swords.svg'
import { ReactComponent as HelmetIcon } from 'icons/helmet-battle.svg'

import { ChooseRollDice } from './actions/RollDice'

import Styles from '../_.module.sass'
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons"

export default function DMActions({ players, api,...props }){

    const [ showRollChooser, setRollChooser ] = useState(false)

    return (
        <>
            <div className={Styles.UserActions}>
                <button className="button is-light is-fullwidth" type="button">
                    <span className="icon">
                        <SwordsIcon />
                    </span>
                    <span>Enter Combat</span>
                </button>
                <button className="button is-light is-fullwidth" type="button">
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
                    let { player, dice, reason } = value
                    // ...
                }}/>
                : <></>
            }
        </>
    )

}