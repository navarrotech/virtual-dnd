import { useEffect, useRef, useState } from "react"
import { useParams, Link, NavLink, useSearchParams, Outlet, useNavigate } from "react-router-dom"
    
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faEllipsisH, faFilePdf, faSave, faTrashAlt } from "@fortawesome/free-solid-svg-icons"

// Redux
import { useAppSelector, dispatch } from "core/redux"
import { setCurrentCharacter } from "redux/characters/reducer.js"
import { saveCurrentCharacter } from "redux/characters/advancedActions"

// Utility
import { downloadPDF, importPDF } from "./DownloadCharacterSheet"
import axios from "axios"

import Styles from "./_.module.sass"
import Dropdown from "common/Dropdown"

// Components
export default function Edit() {
    
    // Params
    const { id } = useParams()

    // Redux
    const currentCharacterId = useAppSelector(state => state.characters.currentCharacterId)

    useEffect(() => {
        if(id !== currentCharacterId){
            dispatch(
                setCurrentCharacter(id)
            )
        }
    }, [ id, currentCharacterId ])

    if(id !== currentCharacterId){
        return <></>
    }

    return (
        <div className="container is-max-widescreen">
            <div className="block columns">
                <Toolbar />
            </div>
            <div className={'block ' + Styles.CharacterSheet}>
                <Outlet />
            </div>
            <div className="block buttons is-right">
                <Dropdown 
                    className="is-right"
                    trigger={<button className="button is-light">
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faEllipsisH}/>
                        </span>
                    </button>}
                >
                    <Import />
                    <Export />
                    <Delete />
                </Dropdown>
                <Save />
            </div>
        </div>
    )
}

const pages = ["stats", "appearance", "spells"]

function Toolbar(){

    const { id } = useParams()
    const [ searchParams ] = useSearchParams()
    const fromCampaignId = searchParams.get('rejoin_campaign');

    return <>
        <div className="column">
            { fromCampaignId
                ? <Link className="button is-primary is-outlined" to={`/play/${fromCampaignId}`}>
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
            <div className="block buttons is-right has-addons are-medium">{
                pages.map(key => <NavLink
                    key={key}
                    to={`/characters/${id}/${key}`}
                    className={({ isActive }) => "button is-capitalized " + (isActive ? " is-primary" : "")}
                    type="button"
                >
                    <span>{ key }</span>
                </NavLink>)
            }</div>
        </div>
    </>
}

function Export(){
    const name = useAppSelector(state => state.user.user.name) || ''
    const currentCharacter = useAppSelector(state => state.characters.current)

    return <a className="dropdown-item" onClick={() => downloadPDF(name, currentCharacter)}>
        <span>Export PDF</span>
        <span className="icon">
            <FontAwesomeIcon icon={faFilePdf}/>
        </span>
    </a>
}

function Import(){
    const reference: any = useRef()

    return <a className="dropdown-item" onClick={() => reference?.current?.click()}>
        <span>Import PDF</span>
        <span className="icon">
            <FontAwesomeIcon icon={faFilePdf}/>
        </span>
        <input
            ref={reference}
            type="file"
            accept=".pdf"
            style={{
                display:'none'
            }}
            onChange={({ target }) => {
                const file = target.files?.[0]
                console.log(file)
                if(file){
                    const reader = new FileReader();
                    reader.onload = () => {
                      const arrayBuffer: any = reader.result; // ArrayBuffer
                      const uint8Array = new Uint8Array(arrayBuffer); // Uint8Array
              
                      // Use the Uint8Array for further processing
                      console.log(uint8Array);
                      importPDF(uint8Array)
                    };
                    reader.readAsArrayBuffer(file);

                }
            }}
        />
    </a>
}

function Delete(){
    const [ showDelete, setShowDelete ] = useState(false)
    const currentCharacterId = useAppSelector(state => state.characters.currentCharacterId)

    return <>
        <a className="dropdown-item is-danger" onClick={() => setShowDelete(true)}>
            <span>Delete Character</span>
            <span className="icon">
                <FontAwesomeIcon icon={faTrashAlt}/>
            </span>
        </a>
        { showDelete 
            ? <DeleteConfirm close={() => setShowDelete(false)} id={currentCharacterId} />
            : <></>
        }
    </>
}

export function DeleteConfirm({ close, id }:{ close: () => any, id?: string }){

    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()
    const character = useAppSelector(state => {
        if(state.characters.currentCharacterId === id){
            return state.characters.current
        }
        return state.characters.list?.[id || '']
    })

    if(!id || !character){
        return <></>
    }

    async function deleteIt(){
        setLoading(true)
        await axios.post(`data/dnd_characters/delete`, { id })
        close()
        navigate('/characters')
    }

    return <div className="modal is-active">
        <div className="modal-background" onClick={() => { close() }}></div>
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">Are you sure you want to delete?</p>
                <button className="delete is-medium" onClick={() => { close() }}></button>
            </header>
            <section className="modal-card-body">
                <h1 className="title">You're about to delete { character.name || 'this character' }</h1>
                <h2 className="subtitle">This deletion can not be undone.</h2>
            </section>
            <footer className="modal-card-foot buttons is-right">
                <button className="button" type="button" onClick={() => { close() }}>
                    <span>Cancel</span>
                </button>
                <button className={"button is-danger" + (loading ? ' is-loading' : '')} type="button" onClick={deleteIt} disabled={loading}>
                    <span>Delete</span>
                </button>
            </footer>
        </div>
    </div>
}

function Save(){
    const hasUnsavedChanges = useAppSelector(state => state.characters.hasUnsavedChanges)
    return <button className="button is-primary" type="button" onClick={() => dispatch(saveCurrentCharacter())} disabled={!hasUnsavedChanges}>
        <span>Save</span>
        <span className="icon">
            <FontAwesomeIcon icon={faSave}/>
        </span>
    </button>
}
