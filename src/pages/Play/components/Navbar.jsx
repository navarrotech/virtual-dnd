import { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faShareAlt } from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ campaign, ...props }) {
    
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
        <nav className="navbar">
            <div className="navbar-brand">
                <div role="button" className="navbar-burger">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </div>
            </div>
        
            <div className="navbar-menu">
                <div className="navbar-start">
                    <div className="block">
                        <h1 className="title">{campaign.name}</h1>
                    </div>
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
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
            </div>
        </nav>
    )

}