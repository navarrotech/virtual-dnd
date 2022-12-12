// import { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBan, faEllipsis, faSync, faXmark } from "@fortawesome/free-solid-svg-icons";

// Firebase
// import { getDatabase, ref, onValue, update } from "firebase/database"

import Dropdown from "common/Dropdown";

// import Styles from './_.module.sass'

export default function CampaignPlayerListItem({ player, index, campaign_uid }) {

    // const [state, setState] = useState({ syncing: false })

    async function sync() {
        // setState({ syncing: true })

        // Experimental: Needs to be ran and tested.
        // onValue(ref(getDatabase(), "/characters/" + player.character_uid), async (snapshot) => {
        //     const updates = {};

        //     updates[`/campaigns/${campaign_uid}/players/${index}/character`] = snapshot.val()

        //     await update(ref(getDatabase()), updates)

        //     // setState({ syncing: false })

        // }, { onlyOnce: true });
    }

    return (
        <div className="level">
            <p>{player.player_name}</p>
            <Dropdown
                trigger={
                    <button className="button is-light is-rounded is-small" type="button">
                        <span className="icon">
                            <FontAwesomeIcon icon={faEllipsis}/>
                        </span>
                    </button>
                }
            >
                <div className="dropdown-item icon-text" onClick={sync}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faSync} />
                    </span>
                    <span>Resync Character</span>
                </div>

                <hr className="dropdown-divider" />
                
                <div className="dropdown-item icon-text is-danger">
                    <span className="icon">
                        <FontAwesomeIcon icon={faXmark} />
                    </span>
                    <span>Kick Player</span>
                </div>
                
                <div className="dropdown-item icon-text is-danger">
                    <span className="icon">
                        <FontAwesomeIcon icon={faBan} />
                    </span>
                    <span>Ban Player</span>
                </div>
            </Dropdown>
        </div>
    )
}