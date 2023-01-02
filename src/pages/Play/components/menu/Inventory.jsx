import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { getDatabase, push, ref, remove, set } from 'firebase/database'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as Potion } from 'icons/flask-round-potion.svg'

import ChooseIcon from "common/ChooseIcon.jsx"

import Icons from 'common/Icons'

import Styles from '../../_.module.sass'

const maxInventorySize = 10

const NumbersOnlyRegex = new RegExp(/\D/gmi)

export default function Inventory({ close, inventory, player_uid, ...props }){

    const [ state, setState ] = useState({
        showAddItem: false,
        showChooseIcon: false,
        icon: 'cube.svg',
        name: '',
        quantity: 1
    })

    const { id } = useParams()

    if(state.showChooseIcon !== false){
        return <ChooseIcon 
            current={state.icon}
            onChoose={(icon) => {
                if(icon){
                    // set(ref(getDatabase(), `campaigns/${id}/players/${player_uid}/inventory/${state.showAddItem}`))
                    console.log("Setting icon!", icon)
                    return setState({ ...state, showChooseIcon: false, icon })
                }
                setState({ ...state, showChooseIcon: false })
            }}
        />
    }

    const remaining_empty_slots = []
    for (let i = 0; i < Math.abs(Object.keys(inventory).length - maxInventorySize); i++) {
        remaining_empty_slots.push(i)
    }

    if(state.showAddItem !== false){
        return <div className="modal is-active">
            <div className="modal-background" onClick={() => { close(false) }}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title" onClick={() => console.log(state)}>Add To Inventory</p>
                    <button className="delete is-medium" onClick={() => { setState({ ...state, showAddItem: false }) }}></button>
                </header>
                <section className="modal-card-body">
                    <div className="block columns is-vcentered">

                        <div className="column is-4">
                            { !Icons[state.icon] ? console.log("Couldn't find icon: " + state.icon) : <></> }
                            <figure className="image is-centered is-128x128 is-clickable" onClick={() => { setState({ ...state, showChooseIcon: true }) }}>
                                <img src={Icons[state.icon] ? Icons[state.icon].element : ''} alt={Icons[state.icon].name}/>
                            </figure>
                        </div>
                        <div className="column">
                            <div className="field">
                                <label className="label input-label">Item Name</label>
                                <div className="control has-icons-left">
                                    <input
                                        autoFocus={true}
                                        className="input is-medium"
                                        type="text"
                                        value={state.name}
                                        placeholder=""
                                        onChange={({ target:{value} }) => {
                                            setState({ ...state, name:value })
                                        }}
                                        maxLength={12}
                                    />
                                    <span className="icon is-left">
                                        <Potion />
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label input-label">Quantity</label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input is-medium"
                                        type="number"
                                        value={String(state.quantity)}
                                        onChange={({ target:{ value } }) => {
                                            try{
                                                value = value.replaceAll(NumbersOnlyRegex, '')
                                                if(value === ''){ return setState({ ...state, quantity:'' }) }
                                                value = parseInt(value)
                                                if(isNaN(value) || value < 0){ return }
                                                setState({ ...state, quantity: value })
                                            } catch(e){ console.log(e) }
                                        }}
                                        onKeyDown={({ keyCode }) => {
                                            return keyCode !== 69
                                        }}
                                        placeholder=""
                                    />
                                    <span className="icon is-left">
                                        <FontAwesomeIcon icon={faLayerGroup}/>
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </section>
                <footer className="modal-card-foot buttons is-right">
                    <button className="button" type="button" onClick={() => { setState({ ...state, showAddItem: false }) }}>
                        <span>Back</span>
                    </button>
                    {/* If state.showAddItem === true, it means it's creating a new inventory slot! */}
                    { state.showAddItem === true
                        ? <button className="button is-primary" type="button" onClick={async function({ target }){
                            if(target.tagName === 'SPAN'){ target = target.parentElement }
                            target.classList.add('is-loading')
    
                            const { name, quantity, icon='cube.svg' } = state
    
                            const reference = ref(getDatabase(), `/campaigns/${id}/players/${player_uid}/inventory`)
                            await push(reference, { name, quantity, icon })
    
                            setState({ ...state, showAddItem: false, name: '', quantity:1, icon: 'cube.svg' })
                        }}>
                            <span>Add Item</span>
                        </button>
                        : <>
                            <button className="button is-danger" type="button" onClick={async function({ target }){
                                if(target.tagName === 'SPAN'){ target = target.parentElement }
                                target.classList.add('is-loading')
        
                                const { showAddItem:uid } = state
        
                                const reference = ref(getDatabase(), `/campaigns/${id}/players/${player_uid}/inventory/${uid}`)
                                await remove(reference)
        
                                setState({ ...state, showAddItem: false, name: '', quantity:1, image:'cube.svg' })
                            }}>
                                <span>Remove Item</span>
                            </button>
                            <button className="button is-primary" type="button" onClick={async function({ target }){
                                if(target.tagName === 'SPAN'){ target = target.parentElement }
                                target.classList.add('is-loading')
        
                                const { name, quantity, icon, showAddItem:uid } = state
        
                                const reference = ref(getDatabase(), `/campaigns/${id}/players/${player_uid}/inventory/${uid}`)
                                await set(reference, { name, quantity, icon })
        
                                setState({ ...state, showAddItem: false, name: '', quantity:1, image:'cube.svg' })
                            }}>
                                <span>Save</span>
                            </button>
                        </>
                    }
                </footer>
            </div>
        </div>
    }

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={() => { close() }}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Inventory</p>
                    <button className="delete is-medium" onClick={() => { close() }}></button>
                </header>
                <section className="modal-card-body">
                    <div className={Styles.Inventory}>
                        {
                            Object.keys(inventory).map((key) => {
                                let { icon='cube.svg', name='', quantity=0 } = inventory[key]
                                return <div key={key} className={Styles.InventorySlot} onClick={() => setState({ ...state, showAddItem: key, icon, quantity, name })}>
                                    <figure className="image is-48x48">
                                        { Icons[icon] ? <img src={Icons[icon].element} alt={name}/> : <img alt={name}/>}
                                    </figure>
                                    <label className={"label " + Styles.inventoryLabel}>{name}</label>
                                    { quantity && quantity !== 1 
                                        ? <p className={Styles.quantityLabel}>{quantity}</p>
                                        : <></>
                                    }
                                </div>
                            })
                        }
                        {
                            // For the remaining slots, create an empty array and map it
                            remaining_empty_slots.map(index => 
                                <div
                                    key={index}
                                    className={Styles.InventorySlot + ' ' + Styles.isEmpty}
                                    onClick={() => setState({ ...state, showAddItem:true, icon:'cube.svg', name:'', quantity: 1 })}
                                />
                            )
                        }
                    </div>
                </section>
                <footer className="modal-card-foot buttons is-right">
                    <button className="button" type="button" onClick={() => { close() }}>
                        <span>Close</span>
                    </button>
                </footer>
            </div>
        </div>
    )

}