import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

// Typescript
import type { CharacterDoc } from "redux/characters/types"

// Redux
import { useAppSelector } from "core/redux"

// Utility
import axios, { type AxiosResponse } from 'axios'

// Styles
import Styles from "./_.module.sass"

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN

export default function List() {

    const list = useAppSelector(state => state.characters.list)

    return (
        <div className="container is-max-widescreen">
            <div className="block level">
                <div className="block buttons is-left">
                    <CreateButton />
                </div>
            </div>
            <div className={"block " + Styles.CharacterList}>{
                Object.entries(list).map(([ id, character ]) => <Link className={Styles.Character} key={id} to={`/characters/${id}/stats`}>
                    <figure className={"image " + Styles.image}>
                        <img src={API_DOMAIN + '/' + character?.image} alt={character.name} crossOrigin="anonymous" />
                    </figure>
                    <div className={Styles.titles}>
                        <h1 className="title">{character.name}</h1>
                        <h2 className="subtitle">{character.features.race} {character.features.class?'|':''} {character.features.class}</h2>
                    </div>
                </Link>)
            }</div>
        </div>
    )
}

function CreateButton(){
    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()

    async function create() {
        setLoading(true)
        const response: AxiosResponse<CharacterDoc, any> = await axios.post(`/data/dnd_characters/create`)

        if(response.status !== 200){
            console.error(response)
            return;
        }

        navigate(`/characters/${response.data.id}/stats`)
    }

    return <button
        className={"button is-primary is-medium" + (loading ? ' is-loading' : '')}
        type="button"
        onClick={create}
    >
        <span>Create +</span>
    </button>
}
