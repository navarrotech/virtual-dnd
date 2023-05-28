
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faBan, faSync, faTrashAlt, faXmark } from "@fortawesome/free-solid-svg-icons"

// UI
import Dropdown from "common/Dropdown"

// Redux
import { useAppSelector } from "core/redux.js"
import moment from "moment"
import { useState } from 'react'

// Utility
import { onKeyDown, saveChanges, deleteCampaign } from './forms'
import { usePlayers } from './hooks'

// import Styles from "./_.module.sass"

export default function ViewOne() {

    const { id='' } = useParams()
    const campaign = useAppSelector((state) => state.campaigns.all[id])

    if(!campaign){
        return <Navigate to="/campaigns" />
    }

    return (
        <div className="container is-max-desktop">
            <div className="block columns">
                <div className="column">
                    <EditName />
                </div>
                <div className="column">
                    <div className="block buttons is-right">
                        <Link className="button is-primary" to={`/play/${id}`}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                            <span>Start Session</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="columns">
                <div className="column is-8">
                    <ManageCharacters />
                </div>
                <div className="column is-4">
                    <div className="box">
                        <div className="field">
                            <p>Campaign Created</p>
                            <p>{moment(campaign.created).format("MMMM Do YYYY")}</p>
                        </div>
                        <div className="field">
                            <Delete />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Delete(){
    const { id='' } = useParams()
    const navigate = useNavigate()
    const [ loading, setLoading ] = useState(false)

    async function deleteIt(){
        setLoading(true)
        const deleted = await deleteCampaign(id)
        if(deleted){
            navigate('/campaigns')
            return
        }
        setLoading(false)
    }

    return <button className={"button is-danger is-fullwidth is-small " + (loading ? 'is-loading' : 'is-light')} type={"button"} onClick={deleteIt}>
        <span className="icon">
            <FontAwesomeIcon icon={faTrashAlt}/>
        </span>
        <span>Delete Campaign</span>
    </button>
}

function EditName(){

    const { id='' } = useParams()
    const user = useAppSelector((state) => state.user.user)
    const defaultName = useAppSelector((state) => state.campaigns.all[id]?.name)
    const campaignOwner = useAppSelector((state) => state.campaigns.all[id]?.owner)
    const [ name, setName ] = useState(defaultName || '')

    const amIOwner = campaignOwner === user.id

    return <div className="field">
        <label className="label">Campaign Name:</label>
        { amIOwner
            ? <div className="control">
                <input
                    className="input is-large"
                    type="text"
                    placeholder="Epic Adventure"
                    value={name}
                    onKeyDown={onKeyDown}
                    onChange={({ target:{ value } }) => setName(value)}
                    onBlur={() => {
                        saveChanges({ name }, id)
                    }}
                />
            </div>
            : <h1 className="title">{ name }</h1>
        }
    </div>
}

function ManageCharacters(){

    const { id='' } = useParams()
    const user = useAppSelector((state) => state.user.user)
    const campaignOwner = useAppSelector((state) => state.campaigns.all[id]?.owner)
    const players = usePlayers(id)

    const amIOwner = campaignOwner === user.id

    function sync(player_id: string){
        return () => {
            // TODO
        }
    }
    function kick(player_id: string){
        return () => {
            // TODO
        }
    }
    function ban(player_id: string){
        return () => {
            // TODO
        }
    }
    async function leave(){
        // TODO
    }

    return <div className="block box">
        <label className="label box-label">Characters</label>
        { amIOwner
            ? <div className="level">
                <p>{user.name} (You)</p>
                <p>Dungeon Master</p>
            </div>
            : <></>
        }
        { players.map((player) => <div key={player.id} className="level">
            <p>{player.first_name} {player.last_name}</p>
            <Dropdown>
                { amIOwner
                    ? <>
                        <a className="dropdown-item icon-text" onClick={sync(player.id)}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faSync} />
                            </span>
                            <span>Resync Character</span>
                        </a>
        
                        <hr className="dropdown-divider" />
                        
                        <a className="dropdown-item icon-text is-danger" onClick={kick(player.id)}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faXmark} />
                            </span>
                            <span>Kick Player</span>
                        </a>
                        
                        <a className="dropdown-item icon-text is-danger" onClick={ban(player.id)}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faBan} />
                            </span>
                            <span>Ban Player</span>
                        </a>
                    </>
                    : player.id === user.id
                        ? <>
                            <a className="dropdown-item icon-text is-danger" onClick={leave}>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faBan} />
                                </span>
                                <span>Leave Game</span>
                            </a>
                        </>
                        : <></>
                }
            </Dropdown>
        </div>
        )
        }
    </div>
}
