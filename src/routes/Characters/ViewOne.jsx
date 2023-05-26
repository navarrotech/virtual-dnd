import { useEffect, useState, useContext } from "react"
import { useParams, useLocation, useNavigate, Link, useSearchParams } from "react-router-dom"
    
import { onValue, set } from "firebase/database"
import useReference from '../../hooks/useReference.jsx'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

import UserContext from "../../context/User.jsx"

import EditorPageOne from "./Components/EditorPageOne.jsx"
import EditorPageTwo from "./Components/EditorPageTwo.jsx"
import EditorPageThr from "./Components/EditorPageThr.jsx"

import Loader from "../../common/Loader.jsx"

import Styles from "./_.module.sass"

export default function ViewOne({ ...props }) {
    
    /* Features: 
     *   class
     *   race
     *   background
     *   alignment
     */

    const { id } = useParams()
    const [ searchParams ] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()

    const [user] = useContext(UserContext)

    const reference = useReference(`characters/${user.uid}/${id}`)

    const [state, setState] = useState({ character: null, loading: true, page: 0 })

    function save(keyValueObject = {}, saveToDatabase = true) {
        let { character } = state

        if (Object.keys(keyValueObject).length) {
            Object.keys(keyValueObject).forEach((key) => {
                if (key.includes(".")) {
                    let L = key.split(".")
                    character[L[0]][L[1]] = keyValueObject[key]
                } else {
                    character[key] = keyValueObject[key]
                }
            })
            character.updated = new Date().toISOString()
            setState({ ...state, character })
        }

        if (saveToDatabase) {
            console.log('Saving to database...')
            set(reference, character)
            if(location.state){
                location.state = character
            }
        }
    }

    useEffect(() => {
        if (location.state) {
            console.log("Gathered information from state!")
            navigate({ state: {} })
            return setState((s) => {
                return { ...s, loading: false, character: location.state }
            })
        }
        onValue(
            reference,
            (snapshot) => {
                const character = snapshot.val()

                // If 404 not found
                if (!character) {
                    return navigate("/characters", { replace: true })
                }

                console.log("Gathered information from database!")
                setState((s) => {
                    return { ...s, loading: false, character }
                })
            },
            { onlyOnce: true },
        )
    }, [reference, location, navigate])

    if (state.loading || !state.character) {
        return <Loader />
    }

    const { character } = state

    return (
        <div className="container is-max-widescreen">
            <div className="block columns">
                <div className="column">
                    {
                        searchParams && searchParams.has && searchParams.has('rejoin_campaign')
                        ? <Link className="button is-primary is-outlined" to={`/play/${searchParams.get('rejoin_campaign')}`}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faArrowLeft}/>
                            </span>
                            <span>Back To Game</span>
                        </Link>
                        : <Link className="button is-primary is-outlined" to={"/characters"}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faArrowLeft}/>
                            </span>
                            <span>Back</span>
                        </Link>
                    }
                </div>
                <div className="column">
                    <div className="block buttons is-right has-addons are-medium">
                        <button className={"button" + (state.page === 0 ? " is-primary" : "")} type="button" onClick={() => { setState({ ...state, page:0 }) }}>
                            <span>Stats</span>
                        </button>
                        <button className={"button" + (state.page === 1 ? " is-primary" : "")} type="button" onClick={() => { setState({ ...state, page:1 }) }}>
                            <span>Appearance</span>
                        </button>
                        <button className={"button" + (state.page === 2 ? " is-primary" : "")} type="button" onClick={() => { setState({ ...state, page:2 }) }}>
                            <span>Spells</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className={Styles.CharacterSheet}>
                {
                    state.page === 0
                        ? <EditorPageOne character={character} save={save} />
                        : state.page === 1
                        ? <EditorPageTwo character={character} save={save} />
                        : <EditorPageThr character={character} save={save} />
                }
            </div>
        </div>
    )
}
