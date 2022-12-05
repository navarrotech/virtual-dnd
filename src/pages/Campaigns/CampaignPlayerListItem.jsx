// import { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBan, faEllipsis, faSync, faXmark } from "@fortawesome/free-solid-svg-icons";

// Firebase
import { getDatabase, ref, onValue, update } from "firebase/database"

// import Styles from './_.module.sass'

export default function CampaignPlayerListItem({ player, index, campaign_uid }) {

    // const [state, setState] = useState({ syncing: false })

    async function sync() {
        // setState({ syncing: true })

        onValue(ref(getDatabase(), "/characters/" + player.character_uid), async (snapshot) => {
            const updates = {};

            updates[`/campaigns/${campaign_uid}/players/${index}/character`] = snapshot.val()

            await update(ref(getDatabase()), updates)

            // setState({ syncing: false })

        }, { onlyOnce: true });
    }

    return (
        <div className="level">
            <p>{player.player_name}</p>
            <div className="dropdown is-right">
                <div className="dropdown-trigger">

                    <button className="button is-primary">
                        <span>Dropdown button</span>
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faEllipsis}/>
                        </span>
                    </button>
            
                </div>
                <div className="dropdown-menu">
                    <div className="dropdown-content">
            
                        <div className="dropdown-item icon-text" onClick={sync}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faSync} />
                            </span>
                            <span>Resync Character Data</span>
                        </div>

                        <hr className="dropdown-divider" />
                        
                        <div className="dropdown-item icon-text is-danger" onClick={sync}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faXmark} />
                            </span>
                            <span>Kick Player</span>
                        </div>
                        
                        <div className="dropdown-item icon-text is-danger" onClick={sync}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faBan} />
                            </span>
                            <span>Ban Player</span>
                        </div>
            
                    </div>
                </div>
            </div>
        </div>
    )
}