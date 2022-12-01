import { useEffect, useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { ref, getDatabase, onValue, set } from "firebase/database"

import UserContext from '../../../context/User.jsx'

import Styles from '../_.module.sass'

import Loader from '../../../common/Loader.jsx'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons'

export default function WelcomeAndJoin({ campaign, owneruid, api }) {

    const [user] = useContext(UserContext)
    const [state, setState] = useState({
        loading: false,
        characters: [],
        selected_character: null
    })

    function joinGame() {
        const { selected_character: character } = state

        set(ref(getDatabase(), `campaigns/${owneruid}/players/${user.uid}`), {
            player_name: user.displayName,
            player_username: user.username,
            player_uid: user.uid,
            character_uid: character.uid,
            character,
            current:{}
        })
    }

    useEffect(() => {
        const unsubscribe = onValue(ref(getDatabase(), "characters/" + user.uid), (snapshot) => {
            let doc = snapshot.val() || {}
            let characters = Object.keys(doc).map(key => {
                return { ...doc[key], uid: key }
            })
            setState((state) => {
                return { ...state, loading: false, characters }
            })
        });
        return () => { unsubscribe(); }
    }, [user])

    return (
        <div className={Styles.WelcomeAndJoin}>
            <div className="block">
                <h1 className="title has-text-centered is-size-1">Welcome</h1>
                <h2 className="subtitle has-text-centered is-size-3">To join this game, select a character to play as.</h2>
            </div>
            <div className="block">
                { state.loading
                    ? <Loader />
                    : state.characters.map(character => {
                        return <div className="block box" onClick={() => {
                            setState({ ...state, selected_character: character })
                        }}>
                            <p>{character.name}</p>
                            <p>{character.features.class}</p>
                        </div>
                    })
                }
                { !state.loading && !state.characters.length
                    ? <div>
                        <p className="has-text-centered">You don't have any characters created! Click below to create your first character</p>
                        <Link className="button is-primary" to="/characters">
                            <span>Create A Character</span>
                            <span className="icon">
                                <FontAwesomeIcon icon={faPlus}/>
                            </span>
                        </Link>
                    </div>
                    : <></>
                }
            </div>
            <div className="block buttons is-centered">
                <button className="button is-primary" type="button" disabled={!state.selected_character} onClick={joinGame}>
                    <span>Join Game</span>
                    <span className="icon">
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </span>
                </button>
            </div>
        </div>
    )

}