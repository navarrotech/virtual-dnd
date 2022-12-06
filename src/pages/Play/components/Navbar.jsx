import { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faShareAlt } from "@fortawesome/free-solid-svg-icons";

import NameTag from 'common/NameTag.jsx'

import Styles from '../_.module.sass'

export default function Navbar({ campaign_name, ...props }) {
    
    const [state, setState] = useState({ sharing: false })

    function shareLink() {
        let t = window.location.href;
        navigator.clipboard.writeText(t);
        
        setState({ ...state, sharing: true })
        setTimeout(() => {
            setState({ ...state, sharing:false })
        }, 2500)
    }

    return (
        <nav className={"navbar columns is-vcentered is-gapless " + Styles.navbar}>
            <div className="column">
                <NameTag/>
            </div>
            <div className="column">
                <h1 className="title has-text-centered m-0">{campaign_name}</h1>
            </div>
            <div className="column">
                <div className="block buttons is-right">
                    <button className={"button is-" + (state.sharing ? 'success' : 'primary')} type="button" onClick={shareLink}>
                    {
                        state.sharing
                        ? <>
                            <span>Link Copied!</span>
                            <span className="icon">
                                <FontAwesomeIcon icon={faCheck}/>
                            </span>
                        </>
                        : <>
                            <span>Invite Others</span>
                            <span className="icon">
                                <FontAwesomeIcon icon={faShareAlt}/>
                            </span>
                        </>
                    }
                    </button>
                </div>
            </div>
        </nav>
    )

}