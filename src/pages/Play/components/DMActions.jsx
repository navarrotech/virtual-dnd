// import { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiceD6, faScroll } from '@fortawesome/free-solid-svg-icons'

import Styles from '../_.module.sass'

export default function DMActions({ players, api,...props }){

    return (
        <div className={Styles.UserActions}>
            <button className="button is-light is-fullwidth" type="button">
                <span className="icon">
                    <FontAwesomeIcon icon={faDiceD6}/>
                </span>
                <span>My Inventory</span>
            </button>
            <button className="button is-light is-fullwidth" type="button">
                <span className="icon">
                    <FontAwesomeIcon icon={faScroll}/>
                </span>
                <span>My Spells</span>
            </button>
        </div>
    )

}