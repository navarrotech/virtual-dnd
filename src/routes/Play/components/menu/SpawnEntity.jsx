import { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDragon, faSync } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as PawClaws } from 'icons/paw-claws-regular.svg'
import { ReactComponent as HammerWar } from 'icons/hammer-war.svg'

import ChooseAvatar from "pages/Characters/Components/ChooseAvatar.jsx"

import Styles from '../../_.module.sass'

// Uses localstorage if possible to remember your last saved choice
const LS_Keys = {
    color: 'spawn_entity_saved_color',
    image: 'spawn_entity_saved_image',
    health: 'spawn_entity_saved_health',
    armorClass: 'spawn_entity_saved_armorclass',
}

const colors = [
    '#FF3554',
    '#ffce35',
    '#1dcc1e',
    '#35e9ff',
    '#358fff',
    '#8235ff',
]

export default function SpawnEntity({ saved, onFinish, ...props }){

    const [ state, setState ] = useState({
        hasName: false,
        showChooseAvatar:false,
        name: '',
        race: '',
        class: '',
        color: localStorage && localStorage.getItem(LS_Keys.color) ? localStorage.getItem(LS_Keys.color) : '#FF3554',
        image: localStorage && localStorage.getItem(LS_Keys.image) ? localStorage.getItem(LS_Keys.image) : 'https://firebasestorage.googleapis.com/v0/b/dnd-virtual.appspot.com/o/avatars%2Fa20.png?alt=media&token=570a1233-68ca-4196-92ed-ed1c7f8a8e02',
        health: localStorage && localStorage.getItem(LS_Keys.health) ? localStorage.getItem(LS_Keys.health) : 30,
        armorClass: localStorage && localStorage.getItem(LS_Keys.armorClass) ? localStorage.getItem(LS_Keys.armorClass) : 12
    })

    if(!state.hasName){
        let is_disabled = !(state.name && state.name.length)
        return (
            <div className="choice">
                <div className="choice-background"></div>
                <div className="choice-content">
                    <header className="choice-title">
                        <div className="block">
                            <h1 className="title is-size-1 has-text-white">Name your creation</h1>
                        </div>
                    </header>
                    <section className="choice-body container is-max-desktop">
                        <div className="field">
                            <div className="control has-icons-left">
                                <input
                                    autoFocus={true}
                                    className="input is-large"
                                    type="text"
                                    placeholder="Name your creation..."
                                    value={state.name}
                                    onChange={({ target:{ value } }) => setState({ ...state, name:value })}
                                    onKeyDown={({key}) => { if(key==='Enter' && !is_disabled){ setState({ ...state, hasName: true }) } }}
                                />
                                <span className="icon is-left">
                                    <FontAwesomeIcon icon={faDragon}/>
                                </span>
                            </div>
                        </div>
                        <div className="filed columns">
                            
                            <div className="column">
                        <div className="field">
                            <div className="control has-icons-left">
                                <input
                                    className="input is-large"
                                    type="text"
                                    placeholder="Race (optional)"
                                    value={state.race}
                                    onChange={({ target:{ value } }) => setState({ ...state, race:value })}
                                />
                                <span className="icon is-left">
                                    <PawClaws />
                                </span>
                            </div>
                        </div>
                            </div>
                            <div className="column">
                                
                        <div className="field">
                            <div className="control has-icons-left">
                                <input
                                    className="input is-large"
                                    type="text"
                                    placeholder="Class (optional)"
                                    value={state.class}
                                    onChange={({ target:{ value } }) => setState({ ...state, class:value })}
                                />
                                <span className="icon is-left">
                                    <HammerWar />
                                </span>
                            </div>
                        </div>
                            </div>
                            
                        </div>
                    </section>
                    <footer className="choice-footer buttons is-centered">
                        <button className="button is-dark is-medium" type="button" onClick={() => onFinish(null)}>
                            <span>Cancel</span>
                        </button>
                        <button className="button is-primary is-medium" type="button" onClick={() => { setState({ ...state, hasName: true }) }} disabled={is_disabled}>
                            <span>Save &amp; Continue</span>
                        </button>
                    </footer>
                </div>
            </div>
        )
    }

    return (<>
        <div className="choice">
            <div className="choice-background"></div>
            <div className="choice-content">
                <header className="choice-title">
                    <div className="block">
                        <h1 className="title is-size-1 has-text-white">Let's give {state.name} some personality</h1>
                    </div>
                </header>
                <section className="choice-body container is-max-desktop">
                    <div className="block columns">
                        
                        <div className="column is-one-third mx-auto">
                            <div className={'block ' + Styles.SpawnEntityPreview}>
                                <figure className="image is-1by1">
                                    <img src='https://firebasestorage.googleapis.com/v0/b/dnd-virtual.appspot.com/o/game%2Fcity.jpg?alt=media&token=2b64d09e-d82b-4451-b056-db92e6e68f11' alt='city'/>
                                </figure>
                                <div
                                    className={Styles.Entity}
                                    style={{
                                        top:  '50%',
                                        left: '50%'
                                    }}
                                >
                                    <img src={state.image} alt={state.name} draggable={false}/>
                                    <label className={Styles.EntityLabel}>{state.name}</label>
                                    <div
                                        className={Styles.EntityPop}
                                        style={{
                                            background: state.color,
                                            width:      '25px',
                                            height:     '25px',
                                            minHeight:  '25px',
                                        }}
                                    />
                                </div>
                            </div>
                                {/* <div className="block">
                                    <figure className="image is-1by1" onClick={() => { setState({ ...state, showChooseAvatar: true }) }}>
                                        <img src={state.image} alt={state.name} />
                                    </figure>
                                </div> */}
                                <div className="block flexlist has-min-widths has-6-per-row is-compact">
                                    {
                                        colors.map(color => {
                                            return <div
                                                key={color}
                                                className="item is-rounded is-clickable"
                                                style={{
                                                    background: color,
                                                    border: `2px solid ${color===state.color?'#ffffff':color}`,
                                                    transform: `scale(${color===state.color?'1.15':'1'})`
                                                }}
                                                onClick={() => {
                                                    if(localStorage && localStorage.setItem){ localStorage.setItem(LS_Keys.color, color) }
                                                    setState({ ...state, color })}
                                                }
                                            />
                                        })
                                    }
                                </div>
                                <button className="button is-light is-fullwidth" type="button" onClick={() => { setState({ ...state, showChooseAvatar: true }) }}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faSync}/>
                                    </span>
                                    <span>Change Image</span>
                                </button>
                            </div>
                    </div>
                </section>
                <footer className="choice-footer buttons is-centered">
                    <button className="button is-light is-medium" type="button" onClick={() => { onFinish(null) }}>
                        <span>Cancel</span>
                    </button>
                    <button className="button is-light is-medium" type="button" onClick={() => { setState({ ...state, hasName: false }) }}>
                        <span>Edit name</span>
                    </button>
                    <button className="button is-primary is-medium" type="button" onClick={() => { onFinish(state) }}>
                        <span>Save &amp; Finish</span>
                    </button>
                </footer>
            </div>
        </div>
        { state.showChooseAvatar
            ? <ChooseAvatar
                current={state.image}
                onChoose={(image) => {
                    if(image){
                        if(localStorage && localStorage.setItem){ localStorage.setItem(LS_Keys.image, image) }
                        return setState({ ...state, showChooseAvatar: false, image })
                    }
                    setState({ ...state, showChooseAvatar: false })
                }}
            />
            : <></>
        }
    </>
    )

}