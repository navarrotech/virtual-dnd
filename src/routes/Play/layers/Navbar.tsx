import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faShareAlt } from "@fortawesome/free-solid-svg-icons";

import { useAppSelector } from 'core/redux';
import { useStore } from 'react-redux';

import NameTag from 'common/NameTag'
import Dropdown from 'common/Dropdown';

import Styles from '../_.module.sass'

export default function Navbar() {
    
    const gameName = useAppSelector(state => state.play.name)
    const myCharacter = useAppSelector(state => state.play.myCharacter)

    const [ sharing, setSharing] = useState(false)

    const store = useStore()

    const { id } = useParams()

    function shareLink(){
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        
        setSharing(true)
        setTimeout(() => {
            setSharing(false)
        }, 2500)
    }

    const subtitle = myCharacter?.name
        ? "Playing as " + myCharacter.name
        : ''

    return (
        <nav className={"navbar columns is-vcentered is-gapless " + Styles.navbar}>
            <div className="column">
                <Dropdown
                    trigger={<NameTag subtitle={subtitle}/>}
                >
                    { myCharacter
                        ? <>
                            <Link to={`/characters/${myCharacter.id}/stats?rejoin_campaign=${id}`} className="dropdown-item">
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
                {/* eslint-disable-next-line */}
                {/* @ts-ignore */}
                <h1 className="title has-text-centered m-0" onClick={() => console.log(store.getState()?.play)}>{ gameName }</h1>
            </div>
            <div className="column">
                <div className="block buttons is-right">
                    <button className={"button is-" + (sharing ? 'success' : 'primary')} type="button" onClick={shareLink}>
                    {
                        sharing
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
