import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faShareAlt } from "@fortawesome/free-solid-svg-icons";

import NameTag from 'common/NameTag.jsx'
import Dropdown from 'common/Dropdown';

import Styles from '../_.module.sass'

export default function Navbar({ campaign_name, player, ...props }) {
    
    const [state, setState] = useState({ sharing: false })
    const { id } = useParams()

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
                <Dropdown
                    trigger={<NameTag subtitle={player && player.character && player.character.name ? "Playing as " + player.character.name : null}/>}
                >
                    { player
                        ? <>
                            <Link to={`/characters/${player.character_uid}?rejoin_campaign=${id}`} className="dropdown-item">
                                Edit Character
                            </Link>
                            <hr className="dropdown-divider" />
                        </>
                        : <></>
                    }
                    
                    <Link to="/campaigns" className="dropdown-item">
                        Dashboard
                    </Link>
                    <Link to="/logout" className="dropdown-item is-danger">
                        Logout
                    </Link>
                </Dropdown>
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