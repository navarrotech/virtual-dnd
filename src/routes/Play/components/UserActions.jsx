import { useState, useContext } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBolt, faBook, faCoins } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as TreasureIcon } from 'icons/treasure-chest.svg'

import CampaignContext from '../CampaignContext.jsx'

import Inventory from './menu/Inventory.jsx'
import Notes from './Notes.jsx'

import Styles from '../_.module.sass'

export default function UserActions({ player, ...props }){

    const campaign = useContext(CampaignContext)
    const { current:{ gold=0, experience=0 }, inventory={}, uid } = campaign.myCharacter

    const [showInventory, setShowInventory] = useState(false)
    const [showNotes,     setShowNotes    ] = useState(false)

    return (
        <div className={Styles.UserActions}>
            <button className="button is-light is-fullwidth" type="button" onClick={() => setShowNotes(true)}>
                <span className="icon">
                    <FontAwesomeIcon icon={faBook} />
                </span>
                <span>My Notes</span>
            </button>
            <button className="button is-light is-fullwidth" type="button" onClick={() => setShowInventory(true)}>
                <span className="icon">
                    <TreasureIcon />
                </span>
                <span>My Inventory</span>
            </button>
            {/* <button className="button is-light is-fullwidth" type="button">
                <span className="icon">
                    <FontAwesomeIcon icon={faScroll}/>
                </span>
                <span>My Spells</span>
            </button> */}
            <div className={Styles.InventoryQuip}>
                <div className="tags">
                    <span className="tag is-black icon-text has-tooltip-bottom" data-tooltip="Money">
                        <span className="icon">
                            <FontAwesomeIcon icon={faCoins}/>
                        </span>
                        <span>{gold}</span>
                    </span>
                    <span className="tag is-black icon-text has-tooltip-bottom" data-tooltip="Experience">
                        <span className="icon">
                            <FontAwesomeIcon icon={faBolt}/>
                        </span>
                        <span>{experience}</span>
                    </span>
                </div>
            </div>
            { showNotes
                ? <Notes onClose={() => { setShowNotes(false) }} />
                : <></>
            }
            { showInventory
                ? <Inventory close={() => setShowInventory(false)} inventory={inventory} player_uid={uid}/>
                : <></>
            }
        </div>
    )

}
