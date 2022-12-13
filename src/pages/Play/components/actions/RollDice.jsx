import { useState } from 'react'

import { ReactComponent as DiceD4Icon } from 'icons/dice-d4.svg'
import { ReactComponent as DiceD6Icon } from 'icons/dice-d6.svg'
import { ReactComponent as DiceD8Icon } from 'icons/dice-d8.svg'
import { ReactComponent as DiceD10Icon } from 'icons/dice-d10.svg'
import { ReactComponent as DiceD12Icon } from 'icons/dice-d12.svg'
import { ReactComponent as DiceD20Icon } from 'icons/dice-d20.svg'

import Styles from '../../_.module.sass'

const reasons = [
    { type:'strength', icon:'strong' }
]

export function ChooseRollDice({ players, onChosen, ...props }){

    const [ whichDice, setDice ]     = useState(null)
    const [ whichPlayer, setPlayer ] = useState(null)
    const [ reason, setReason ]      = useState(null)

    if(!whichPlayer){
        return (
            <div className="choice">
                <div className="choice-background"></div>
                <div className="choice-content">
                    <header className="choice-title">
                        <h1 className="title">Who do you want to roll?</h1>
                    </header>
                    <section className="choice-body container is-max-desktop">
                        <div className={"block flexlist has-3-per-row is-centered"}>
                            {
                                Object.keys(players).map(key => {
                                    let player = players[key]
                                    return <div key={key} className={"item box is-clickable has-text-centered " + Styles.ChoiceBox} onClick={() => setPlayer(key)}>
                                        <h1 className="title">{player.character.name}</h1>
                                        <h2 className="subtitle">{player.name}</h2>
                                    </div>
                                })
                            }
                        </div>
                    </section>
                    <footer className="choice-footer buttons is-centered">
                        <button className="button is-light is-medium" type="button" onClick={() => { onChosen(null) }}>
                            <span>Cancel</span>
                        </button>
                    </footer>
                </div>
            </div>
        )
    }

    if(!whichDice){
        return (
            <div className="choice">
                <div className="choice-background"></div>
                <div className="choice-content">
                    <header className="choice-title">
                        <h1 className="title">What dice should they roll?</h1>
                    </header>
                    <section className="choice-body container is-max-desktop">
                        <div className="block columns">
                            
                            <div className="column">
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('D4')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD4Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D4</p>
                                </div>
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('D10')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD10Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D10</p>
                                </div>
                            </div>
                            <div className="column">
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('D6')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD6Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D6</p>
                                </div>
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('D12')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD12Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D12</p>
                                </div>
                            </div>
                            <div className="column">
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('D8')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD8Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D8</p>
                                </div>
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('D20')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD20Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D20</p>
                                </div>
                            </div>
                            
                        </div>
                    </section>
                    <footer className="choice-footer buttons is-centered">
                        <button className="button is-light is-medium" type="button" onClick={() => { onChosen(null) }}>
                            <span>Cancel</span>
                        </button>
                    </footer>
                </div>
            </div>
        )
    }

    if(!reason){
        return (
            <div className="choice">
                <div className="choice-background"></div>
                <div className="choice-content">
                    <header className="choice-title">
                        <h1 className="title">What kind of check?</h1>
                    </header>
                    <section className="choice-body container is-max-desktop">
                        <div className="block columns">
                            
                            <div className="column">
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setReason('')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD4Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D4</p>
                                </div>
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setReason('')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD10Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D10</p>
                                </div>
                            </div>
                            <div className="column">
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setReason('')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD6Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D6</p>
                                </div>
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setReason('')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD12Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D12</p>
                                </div>
                            </div>
                            <div className="column">
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setReason('')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD8Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D8</p>
                                </div>
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setReason('')}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD20Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D20</p>
                                </div>
                            </div>
                            
                        </div>
                    </section>
                    <footer className="choice-footer buttons is-centered">
                        <button className="button is-light is-medium" type="button" onClick={() => { onChosen(null) }}>
                            <span>Cancel</span>
                        </button>
                    </footer>
                </div>
            </div>
        )
    }

}