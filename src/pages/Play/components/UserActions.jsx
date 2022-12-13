import { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBolt, faCoins } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as TreasureIcon } from 'icons/treasure-chest.svg'

import Styles from '../_.module.sass'

export default function UserActions({ player, api,...props }){

    const { current:{ gold=0, experience=0 }, inventory={} } = player

    const [showInventory, setShowInventory] = useState(false)

    const maxInventorySize = 10

    const remaining_empty_slots = []
    for (let i = 0; i < Math.abs(Object.keys(inventory).length - maxInventorySize); i++) {
        remaining_empty_slots.push(i)
    }

    return (
        <div className={Styles.UserActions}>
            <button className="button is-light is-fullwidth" type="button" onClick={() => setShowInventory(true)}>
                <span className="icon">
                    <TreasureIcon />
                </span>
                <span>My Inventory</span>
            </button>
            {/* <button className="button is-light is-fullwidth" type="button">
                <span className="icon">
                    <FontAwesomeIcon icon={faScroll}/>
                </span>
                <span>My Spells</span>
            </button> */}
            <div className={Styles.InventoryQuip}>
                <div className="tags">
                    <span className="tag is-black icon-text" data-tooltip="Money">
                        <span className="icon">
                            <FontAwesomeIcon icon={faCoins}/>
                        </span>
                        <span>{gold}</span>
                    </span>
                    <span className="tag is-black icon-text" data-tooltip="Experience">
                        <span className="icon">
                            <FontAwesomeIcon icon={faBolt}/>
                        </span>
                        <span>{experience}</span>
                    </span>
                </div>
            </div>
            { showInventory
                ? <div className={"modal is-active"}>
                    <div className="modal-background" onClick={() => { setShowInventory(false) }}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Inventory</p>
                            <button className="delete is-medium" onClick={() => { setShowInventory(false) }}></button>
                        </header>
                        <section className="modal-card-body">
                            <div className={Styles.Inventory}>
                                {
                                    Object.keys(inventory).map((key) => {
                                        let { image='', name='', quantity=0 } = inventory[key]
                                        return <div key={key} className={Styles.InventorySlot}>
                                            <figure className="image is-64x64">
                                                <img src={image} alt={name}/>
                                            </figure>
                                            <label className="label">{name}</label>
                                            <p>{quantity}</p>
                                        </div>
                                    })
                                }
                                {
                                    // For the remaining slots, create an empty array and map it
                                    remaining_empty_slots
                                        .map(index => {
                                            return <div key={index} className={Styles.InventorySlot + ' ' + Styles.isEmpty}></div>
                                        })
                                }
                            </div>
                        </section>
                        <footer className="modal-card-foot buttons is-right">
                            <button className="button" type="button" onClick={() => { setShowInventory(false) }}>
                                <span>Close</span>
                            </button>
                        </footer>
                    </div>
                </div>
                : <></>
            }
        </div>
    )

}