import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { getDatabase, push, ref, remove, set } from 'firebase/database'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as Potion } from 'icons/flask-round-potion.svg'

import Styles from '../../_.module.sass'

const maxInventorySize = 10

const NumbersOnlyRegex = new RegExp(/\D/gmi)

export default function Inventory({ close, inventory, player_uid, ...props }){

    const [ state, setState ] = useState({
        showAddItem: false,
        name: '',
        quantity: 1
    })

    const { id } = useParams()

    const remaining_empty_slots = []
    for (let i = 0; i < Math.abs(Object.keys(inventory).length - maxInventorySize); i++) {
        remaining_empty_slots.push(i)
    }

    if(state.showAddItem !== false){
        return <div className="modal is-active">
            <div className="modal-background" onClick={() => { close(false) }}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Add To Inventory</p>
                    <button className="delete is-medium" onClick={() => { setState({ ...state, showAddItem: false }) }}></button>
                </header>
                <section className="modal-card-body">
                    <div className="block columns">
                        
                        <div className="column is-4">
                            
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
    
                            const { name, quantity } = state
    
                            const reference = ref(getDatabase(), `/campaigns/${id}/players/${player_uid}/inventory`)
                            await push(reference, { name, quantity, image: '' })
    
                            setState({ ...state, showAddItem: false, name: '', quantity:1, image:'' })
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
        
                                setState({ ...state, showAddItem: false, name: '', quantity:1, image:'' })
                            }}>
                                <span>Remove Item</span>
                            </button>
                            <button className="button is-primary" type="button" onClick={async function({ target }){
                                if(target.tagName === 'SPAN'){ target = target.parentElement }
                                target.classList.add('is-loading')
        
                                const { name, quantity, showAddItem:uid } = state
        
                                const reference = ref(getDatabase(), `/campaigns/${id}/players/${player_uid}/inventory/${uid}`)
                                await set(reference, { name, quantity, image: '' })
        
                                setState({ ...state, showAddItem: false, name: '', quantity:1, image:'' })
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

                                let {
                                    // image='',
                                    name='',
                                    quantity=0
                                } = inventory[key]

                                return <div
                                    key={key}
                                    className={Styles.InventorySlot}
                                    onClick={() => {
                                        setState({
                                            showAddItem: key,
                                            // image,
                                            quantity,
                                            name
                                        })
                                    }}
                                >
                                    <figure className="image is-64x64">
                                        {/* <img src={image} alt={name}/> */}
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
                            remaining_empty_slots
                                .map(index => {
                                    return <div
                                        key={index}
                                        className={Styles.InventorySlot + ' ' + Styles.isEmpty}
                                        onClick={() => setState({ ...state, showAddItem:true })}
                                    />
                                })
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