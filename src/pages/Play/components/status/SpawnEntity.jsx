import { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDragon, faSync } from '@fortawesome/free-solid-svg-icons'

import ChooseAvatar from "pages/Characters/Components/ChooseAvatar.jsx"

// Uses localstorage if possible to remember your last saved choice

const LS_Keys = {
    color: 'spawn_entity_saved_color',
    image: 'spawn_entity_saved_image',
    health: 'spawn_entity_saved_health',
    armorClass: 'spawn_entity_saved_armorclass',
}

const colors = [
    '#FF3554',
    '#FF3554',
    '#FF3554',
    '#FF3554',
    '#FF3554',
    '#FF3554',
]

export default function SpawnEntity({ onFinish, ...props }){

    const [ state, setState ] = useState({
        hasName: false,
        showChooseAvatar:false,
        name: '',
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
                                    placeholder="Entity Name"
                                    value={state.name}
                                    onChange={({ target:{ value } }) => setState({ ...state, name:value })}
                                    onKeyDown={({key}) => { if(key==='Enter' && !is_disabled){ setState({ ...state, hasName: true }) } }}
                                />
                                <span className="icon is-left">
                                    <FontAwesomeIcon icon={faDragon}/>
                                </span>
                            </div>
                        </div>
                    </section>
                    <footer className="choice-footer buttons is-centered">
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
                        
                        <div className="column">
                            <div className="flexlist has-min-widths">
                                {
                                    colors.map(color => {
                                        return <div
                                            key={color}
                                            className="item is-rounded is-clickable"
                                            style={{
                                                background: color,
                                                border: `2px solid ${color===state.color?'#ffffff':'transparent'}`,
                                                transform: `scale(${color===state.color?'1.08':'1'})`
                                            }}
                                            onClick={() => setState({ ...state, color })}
                                        />
                                    })
                                }
                            </div>
                        </div>
                        <div className="column is-one-third">
                            <div className="block is-clickable">
                                <div className="block">
                                    <figure className="image is-1by1" onClick={() => { setState({ ...state, showChooseAvatar: true }) }}>
                                        <img src={state.image} alt={state.name} />
                                    </figure>
                                </div>
                                <button className="button is-primary" type="button" onClick={() => { setState({ ...state, showChooseAvatar: true }) }}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faSync}/>
                                    </span>
                                    <span>Change Image</span>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                </section>
                <footer className="choice-footer buttons is-centered">
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