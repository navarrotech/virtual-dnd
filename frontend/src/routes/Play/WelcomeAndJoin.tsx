import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useAppSelector } from "core/redux"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons'

// // UI
import Logo from 'images/logo.svg'

// // Styles
import CharacterStyles from "routes/Characters/_.module.sass"
import Styles from './_.module.sass'
import axios from 'axios'

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN

export default function WelcomeAndJoin() {

    const { id='' } = useParams()

    const [ loading, setLoading ] = useState(false)
    const [ selectedCharacterId, setSelected ] = useState('')
    const navigate = useNavigate()

    const myCharacters = useAppSelector(state => state.characters.list)
    
    const characters = Object.entries(myCharacters)

    async function joinGame() {
        const character = myCharacters[selectedCharacterId]
        if(!character){
            return
        }

        setLoading(true)
        const result = await axios.post(`play/join`, {
            campaign_id: id,
            character_id: selectedCharacterId
        })
        if(result.status === 200){
            navigate(
                `/bounce?to=${
                    encodeURIComponent(`/play/${id}`)
                }`
            )
        }
    }

    return (
        <div className={'section ' + Styles.WelcomeAndJoin}>
            <div className="hero is-halfheight">
                <div className="hero-body">
                    <div className="container">
                        <figure className="block image is-64x64 is-centered">
                            <img src={Logo} alt="Navarrotech"/>
                        </figure>
                        <div className="block">
                            <h1 className="title has-text-centered is-size-1 has-text-white">Join Game</h1>
                            <h2 className="subtitle has-text-centered is-size-3 has-text-white">
                                {
                                    !loading && !characters.length
                                        ? <>To join this game, you need to create a character first.</>
                                        : <>Select a character to play as.</>
                                }
                            </h2>
                        </div>
                        <div className={"block " + CharacterStyles.CharacterList + " " + CharacterStyles.onDark}>{ 
                            characters.map(([ characterId, character ]) => (
                                <div
                                    className={CharacterStyles.Character 
                                        + (selectedCharacterId === characterId ? ' ' + CharacterStyles.isSelected : '') 
                                        + ' is-clickable'
                                    }
                                    key={characterId}
                                    onClick={() => setSelected(characterId)}
                                >
                                    <figure className={"image " + CharacterStyles.image}>
                                        <img src={API_DOMAIN + '/' + character?.image} alt={character.name} crossOrigin="anonymous" />
                                    </figure>
                                    <div className={CharacterStyles.titles}>
                                        <h1 className="title">{character.name}</h1>
                                        <h2 className="subtitle">{character.features.race} {character.features.class?'|':''} {character.features.class}</h2>
                                    </div>
                                </div>
                                )
                            )
                        }</div>
                        <div className="block buttons is-centered">
                        { !loading && !characters.length
                            ? <Link className="button is-primary" to="/characters">
                                <span>Create A Character</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faPlus}/>
                                </span>
                            </Link>
                            : <button
                                className={"button is-primary " + (loading ? ' is-loading' : '')}
                                type="button"
                                disabled={!selectedCharacterId}
                                onClick={joinGame}
                            >
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
