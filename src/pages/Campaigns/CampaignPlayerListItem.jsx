import { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSync } from "@fortawesome/free-solid-svg-icons";

// Firebase
import { getDatabase, ref, onValue, update } from "firebase/database"

// import Styles from './_.module.sass'

export default function CampaignPlayerListItem({ player, index, campaign_uid }) {

    const [state, setState] = useState({ syncing: false })

    async function sync() {
        setState({ syncing: true })

        onValue(ref(getDatabase(), "/characters/" + player.character_uid), async (snapshot) => {
            const updates = {};

            updates[`/campaigns/${campaign_uid}/players/${index}/character`] = snapshot.val()

            await update(ref(getDatabase()), updates)

            setState({ syncing: false })

        }, { onlyOnce: true });
    }

    return (
        <div className="box level">
            <p>{player.player_name}</p>
            <button className={"button is-light"+(state.syncing?' is-loading':'')} type="button" data-tooltip="Resync Character Data" onClick={sync}>
                <span className="icon">
                    <FontAwesomeIcon icon={faSync} />
                </span>
            </button>
        </div>
    )
}