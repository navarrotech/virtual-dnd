import { useEffect, useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { ref, getDatabase, onValue, set } from "firebase/database"

import UserContext from 'context/User.jsx'

import Styles from '../_.module.sass'
import CharacterStyles from "pages/Characters/_.module.sass"

import CharacterItem from 'pages/Characters/Components/CharacterTile.jsx'
import Loader from 'common/Loader.jsx'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons'

import NavarrotechLogo from 'images/logo.svg'

export default function WelcomeAndJoin({ campaign, owneruid, api }) {

    const [user] = useContext(UserContext)
    const [state, setState] = useState({
        loading: false,
        characters: [],
        selected_character: null
    })

    function joinGame() {
        const { selected_character: character } = state

        set(ref(getDatabase(), `campaigns/${campaign.uid}/players/${user.uid}`), {
            player_name: user.displayName,
            character_uid: character.uid,
            character,
            current:{
                health: 30,
                maxHealth: 0,
                armorClass: 0,
                initiative: 0,
                speed: 30,
                level: 1,
                experience: 0
            }
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
        <div className={'section ' + Styles.WelcomeAndJoin}>
            <div className="hero is-halfheight">
                <div className="hero-body">
                    <div className="container is-max-desktop">
                        <figure className="block image is-64x64 is-centered">
                            <img src={NavarrotechLogo} alt="Navarrotech"/>
                        </figure>
                        <div className="block">
                            <h1 className="title has-text-centered is-size-1 has-text-white">Join Game</h1>
                            <h2 className="subtitle has-text-centered is-size-3 has-text-white">
                                {
                                    !state.loading && !state.characters.length
                                        ? <>To join this game, you need to create a character first.</>
                                        : <>Select a character to play as.</>
                                }
                                
                            </h2>
                        </div>
                        <div className={"block " + CharacterStyles.CharacterList + " " + CharacterStyles.onDark}>
                            { state.loading
                                ? <Loader />
                                : state.characters.map(character => {
                                    return <CharacterItem
                                        key={character.uid}
                                        character={character}
                                        selected={state.selected_character ? state.selected_character.uid === character.uid : false}
                                        onClick={() => {
                                            setState({ ...state, selected_character: character });
                                        }}
                                    />
                                    // return <p>Character</p>
                                })
                            }
                        </div>
                        <div className="block buttons is-centered">
                        { !state.loading && !state.characters.length
                            ? <Link className="button is-primary" to="/characters">
                                <span>Create A Character</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faPlus}/>
                                </span>
                            </Link>
                            : <button className="button is-primary" type="button" disabled={!state.selected_character} onClick={joinGame}>
                                <span>Join Game</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faArrowRight}/>
                                </span>
                            </button>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}