import { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { ReactComponent as SwordsIcon } from 'icons/swords.svg'
import { ReactComponent as HelmetIcon } from 'icons/helmet-battle.svg'

import { ReactComponent as DiceD4Icon } from 'icons/dice-d4.svg'
import { ReactComponent as DiceD6Icon } from 'icons/dice-d6.svg'
import { ReactComponent as DiceD8Icon } from 'icons/dice-d8.svg'
import { ReactComponent as DiceD10Icon } from 'icons/dice-d10.svg'
import { ReactComponent as DiceD12Icon } from 'icons/dice-d12.svg'
import { ReactComponent as DiceD20Icon } from 'icons/dice-d20.svg'

import Styles from '../_.module.sass'
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons"

export default function DMActions({ players, api,...props }){

    const [ showRollChooser, setRollChooser ] = useState(false)

    return (
        <>
            <div className={Styles.UserActions}>
                <button className="button is-light is-fullwidth" type="button">
                    <span className="icon">
                        <SwordsIcon />
                    </span>
                    <span>Enter Combat</span>
                </button>
                <button className="button is-light is-fullwidth" type="button">
                    <span className="icon">
                        <HelmetIcon />
                    </span>
                    <span>Spawn Entity</span>
                </button>
                <button className="button is-light is-fullwidth" type="button" onClick={() => setRollChooser(true)}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faDiceD20}/>
                    </span>
                    <span>Make Player Roll</span>
                </button>
            </div>
            {
                showRollChooser
                ? <div className="choice">
                    <div className="choice-background"></div>
                    <div className="choice-content">
                        <header className="choice-title">
                            <h1 className="title">What dice should they roll?</h1>
                        </header>
                        <section className="choice-body container is-max-desktop">
                            <div className="block columns">
                                
                                <div className="column">
                                    <div className={"box is-clickable " + Styles.ChoiceBox}>
                                        <div className="field icon is-large mx-auto is-block">
                                            <DiceD4Icon className="" />
                                        </div>
                                        <p className="is-size-4 has-text-centered">D4</p>
                                    </div>
                                    <div className={"box is-clickable " + Styles.ChoiceBox}>
                                        <div className="field icon is-large mx-auto is-block">
                                            <DiceD10Icon className="" />
                                        </div>
                                        <p className="is-size-4 has-text-centered">D10</p>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className={"box is-clickable " + Styles.ChoiceBox}>
                                        <div className="field icon is-large mx-auto is-block">
                                            <DiceD6Icon className="" />
                                        </div>
                                        <p className="is-size-4 has-text-centered">D6</p>
                                    </div>
                                    <div className={"box is-clickable " + Styles.ChoiceBox}>
                                        <div className="field icon is-large mx-auto is-block">
                                            <DiceD12Icon className="" />
                                        </div>
                                        <p className="is-size-4 has-text-centered">D12</p>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className={"box is-clickable " + Styles.ChoiceBox}>
                                        <div className="field icon is-large mx-auto is-block">
                                            <DiceD8Icon className="" />
                                        </div>
                                        <p className="is-size-4 has-text-centered">D8</p>
                                    </div>
                                    <div className={"box is-clickable " + Styles.ChoiceBox}>
                                        <div className="field icon is-large mx-auto is-block">
                                            <DiceD20Icon className="" />
                                        </div>
                                        <p className="is-size-4 has-text-centered">D20</p>
                                    </div>
                                </div>
                                
                            </div>
                        </section>
                        <footer className="choice-footer buttons is-centered">
                            <button className="button is-light is-medium" type="button" onClick={() => { setRollChooser(false) }}>
                                <span>Cancel</span>
                            </button>
                        </footer>
                    </div>
                </div>
                : <></>
            }
        </>
    )

}