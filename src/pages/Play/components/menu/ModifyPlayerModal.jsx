import { useMemo, useState, useContext } from "react"
import { useParams } from "react-router-dom";

import { getDatabase, ref, remove, set } from "firebase/database"

import CampaignContext from '../../CampaignContext.jsx'

import Loader from "common/Loader";

export default function ModifyPlayerModal({ player, onClose, ...props }){

    const campaign = useContext(CampaignContext)
    const { isDungeonMaster=false } = campaign

    const {
        uid: player_uid,
        player_name,
        character: {
            name,
            features
        },
        current: {
            health: initialHealth,
            maxHealth: initialMaxHealth=30
        }
    } = player;

    const { id } = useParams()
    const isNPC = player_name === 'NPC'
    const database = useMemo(() => getDatabase(), [])

    const [state, setState] = useState({
        loading: false,
        health: initialHealth,
        maxHealth: initialMaxHealth
    })

    if(state.loading){
        return <Loader />
    }

    function close(){
        if(initialHealth !== state.health && player_uid){
            set(
                ref(getDatabase(), `/campaigns/${id}/players/${player_uid}/current/health`),
                state.health
            )
        }
        if(initialMaxHealth !== state.maxHealth && player_uid){
            set(
                ref(getDatabase(), `/campaigns/${id}/players/${player_uid}/current/maxHealth`),
                state.maxHealth
            )
        }

        onClose()
    }

    function removePlayer(ban=false){
        setState({ ...state, loading:true })

        if(!player_uid){ return; }

        let promises = [
            remove(ref(database, `campaigns/${id}/players/${player_uid}`)),
            remove(ref(database, `campaigns/${id}/map/entities/${player_uid}`))
        ]

        if(ban){
            promises.push(
                set(ref(database, `campaigns/${id}/banned/${player_uid}`), true)
            )
        }

        Promise
            .all(promises)
            .finally(() => close())
    }

    if(!isDungeonMaster){
        return (
            <div className="modal is-active">
                <div className="modal-background" onClick={close}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">
                            <h1 className="title is-size-4">Viewing { name }</h1>
                            <h2 className="subtitle is-size-6">Played by {player_name}</h2>
                        </p>
                        <button className="delete is-medium" onClick={close}></button>
                    </header>
                    <section className="modal-card-body">
                        <div className="block columns">
                            
                            <div className="column">
                                { Object.keys(features).map(feature => {
                                    // Whitelist
                                    if(['backstory'].includes(feature)){ return null; }

                                    let value = features[feature]
                                    if(!value){ return null }
                                    return <p key={feature}>
                                        <strong className="is-capitalized">{feature}:</strong>
                                        &nbsp;<span>{value}</span>
                                    </p>
                                }) }
                            </div>
                            <div className="column">
                                {
                                    features.backstory
                                    ? <>
                                        <strong>Backstory</strong>
                                        <p>{features.backstory}</p>
                                    </>
                                    : <></>
                                }
                            </div>
                            
                        </div>
                    </section>
                    <footer className="modal-card-foot buttons is-right">
                        {
                            isNPC
                            ? <></>
                            : <>
                                {/* <button className="button is-danger is-light" type="button" onClick={() => { removePlayer() }}>
                                    <span>Report Player</span>
                                </button> */}
                            </>
                        }
                        <button className="button is-light" type="button" onClick={close}>
                            <span>Close</span>
                        </button>
                    </footer>
                </div>
            </div>
        )
    }

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={close}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Editing { name }</p>
                    <button className="delete is-medium" onClick={close}></button>
                </header>
                <section className="modal-card-body">
                    <div className="block columns">
                        
                        <div className="column">
                            <p className="is-size-6"><strong>Current Health: {state.health} / {state.maxHealth}</strong></p>
                            <div className="is-relative">
                                <input
                                    className="slider is-fullwidth is-success"
                                    step="1"
                                    min="0"
                                    max={state.maxHealth}
                                    value={state.health}
                                    onChange={({ target:{value} }) => {
                                        setState({ ...state, health:value })
                                    }}
                                    type="range"
                                />
                                {/* <div className="output-fill" style={{ width: Math.round((state.health / state.maxHealth) * 100)+'%' }}></div> */}
                            </div>
                        </div>
                        <div className="column is-2">
                            <div className="field">
                                <label className="label has-text-centered is-size-7">Max Health</label>
                                <div className="control">
                                    <input 
                                        className="input is-medium has-text-centered"
                                        type="text"
                                        placeholder=""
                                        value={state.maxHealth}
                                        onChange={({target:{value}}) => setState({ ...state, maxHealth: value })}
                                    />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    {/* <h1 className="title">{ player_name }</h1> */}
                </section>
                <footer className="modal-card-foot buttons is-right">
                    {
                        isNPC
                        ? <>
                            <button className="button is-danger" type="button" onClick={() => { removePlayer() }}>
                                <span>Murder NPC</span>
                            </button>
                        </>
                        : <>
                            {/* <button className="button is-danger" type="button" onClick={() => { removePlayer(true) }}>
                                <span>Ban Player</span>
                            </button> */}
                            <button className="button is-danger is-light" type="button" onClick={() => { removePlayer() }}>
                                <span>Kick Player</span>
                            </button>
                        </>
                    }
                    <button className="button is-primary" type="button" onClick={close}>
                        <span>Save</span>
                    </button>
                </footer>
            </div>
        </div>
    )

}