import { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as DiceD4Icon } from 'icons/dice-d4.svg'
import { ReactComponent as DiceD6Icon } from 'icons/dice-d6.svg'
import { ReactComponent as DiceD8Icon } from 'icons/dice-d8.svg'
import { ReactComponent as DiceD10Icon } from 'icons/dice-d10.svg'
import { ReactComponent as DiceD12Icon } from 'icons/dice-d12.svg'
import { ReactComponent as DiceD20Icon } from 'icons/dice-d20.svg'

import { ReactComponent as BoltAuto } from 'icons/bolt-auto.svg'

import CountdownProgressbar from 'common/CountdownProgressbar'

import moment from 'moment'

import Styles from '../../_.module.sass'

export function ChooseRollDice({ players, onChosen }){

    const [ dice, setDice ]     = useState(null)
    const [ player, setPlayer ] = useState(null)

    function finish(reason){
        onChosen({ reason, who:player, dice })
    }
    if(!player){
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
                                    if(player.player_name === 'NPC'){ return null }
                                    return <div key={key} className={"item box is-clickable has-text-centered " + Styles.ChoiceBox} onClick={() => setPlayer(key)}>
                                        <h1 className="title">{player.character.name}</h1>
                                        <h2 className="subtitle">({player.player_name})</h2>
                                    </div>
                                })
                            }
                        </div>
                    </section>
                    <footer className="choice-footer buttons is-centered">
                        <button className="button is-light" type="button" onClick={() => { onChosen(null) }}>
                            <span>Cancel</span>
                        </button>
                    </footer>
                </div>
            </div>
        )
    }

    if(!dice){
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
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice(4)}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD4Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D4</p>
                                </div>
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice(12)}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD12Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D12</p>
                                </div>
                            </div>
                            <div className="column">
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice(6)}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD6Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D6</p>
                                </div>
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice(20)}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD20Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D20</p>
                                </div>
                            </div>
                            <div className="column">
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice(8)}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD8Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D8</p>
                                </div>
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice(50)}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD20Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D50</p>
                                </div>
                            </div>
                            <div className="column">
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice(10)}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD10Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D10</p>
                                </div>
                                <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice(100)}>
                                    <div className="field icon is-large mx-auto is-block">
                                        <DiceD20Icon className="" />
                                    </div>
                                    <p className="is-size-4 has-text-centered">D100</p>
                                </div>
                            </div>
                            
                        </div>
                    </section>
                    <footer className="choice-footer buttons is-centered">
                        <button className="button is-light is-medium" type="button" onClick={() => { setPlayer(null) }}>
                            <span>Back</span>
                        </button>
                    </footer>
                </div>
            </div>
        )
    }

    return (
        <div className="choice">
            <div className="choice-background"></div>
            <div className="choice-content">
                <header className="choice-title">
                    <h1 className="title">What kind of check?</h1>
                </header>
                <section className="choice-body container is-max-widescreen">
                    <div className="block columns">
                        
                        <div className="column">
                            <h1 className="title has-text-centered has-text-white">Strength</h1>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('strength')}>
                                <span>Strength Check</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('athletics')}>
                                <span>Athletics</span>
                            </div>
                        </div>
                        <div className="column">
                            <h1 className="title has-text-centered has-text-white">Dexterity</h1>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('dexterity')}>
                                <span>Dexterity Check</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('acrobatics')}>
                                <span>Acrobatics</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('sleight of hand')}>
                                <span>Sleight of hand</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('stealth')}>
                                <span>Stealth</span>
                            </div>
                        </div>
                        <div className="column">
                            <h1 className="title has-text-centered has-text-white">Charisma</h1>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('charisma')}>
                                <span>Charisma Check</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('deception')}>
                                <span>Deception</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('intimidation')}>
                                <span>Intimidation</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('performance')}>
                                <span>Performance</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('persuasion')}>
                                <span>Persuasion</span>
                            </div>
                        </div>
                        <div className="column">
                            <h1 className="title has-text-centered has-text-white">Intelligence</h1>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('intelligence')}>
                                <span>Intelligence Check</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('arcana')}>
                                <span>Arcana</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('history')}>
                                <span>History</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('investigation')}>
                                <span>Investigation</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('nature')}>
                                <span>Nature</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('religion')}>
                                <span>Religion</span>
                            </div>
                        </div>
                        <div className="column">
                            <h1 className="title has-text-centered has-text-white">Wisdom</h1>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('wisdom')}>
                                <span>Wisdom Check</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('animal handling')}>
                                <span>Animal Handling</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('insight')}>
                                <span>Insight</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('medicine')}>
                                <span>Medicine</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('perception')}>
                                <span>Perception</span>
                            </div>
                            <div className="field button is-white is-primary-hover is-fullwidth" onClick={() => finish('survival')}>
                                <span>Survival</span>
                            </div>
                        </div>

                    </div>
                </section>
                <footer className="choice-footer buttons is-centered are-medium">
                    <button className="button is-light" type="button" onClick={() => { setDice(null) }}>
                        <span>Back</span>
                    </button>
                    <button className="button is-primary" type="button" onClick={() => { finish('NA') }}>
                        <span>Skip</span>
                    </button>
                </footer>
            </div>
        </div>
    )

}

export function RollDice({ roll=20, check='NA', onRolled }){

    const [ showInput, setShowInput ] = useState(false)

    function autoRoll(){
        onRolled(
            1 + Math.floor(Math.random() * (roll-1))
        )
    }

    if(showInput){
        let possibilies = []
        for (let i = 0; i < roll; i++) {
                possibilies.push(<div key={i} className={"item box is-clickable has-text-centered mb-0 " + Styles.ChoiceBox} onClick={() => onRolled(i+1)}>
                <h1 className="title">{i+1}</h1>
            </div>)
        }

        let row_limit = 5
        if(roll===4 || roll===8){ row_limit = 4 }
        else if(roll===6 || roll===12){ row_limit = 6 }

        return (
            <div className="choice">
                <div className="choice-background"></div>
                <div className="choice-content">
                    <header className="choice-title">
                        <h1 className="title">What did you roll?</h1>
                        <h2 className="subtitle">(Don't include modifiers, we'll do that for you!)</h2>
                    </header>
                    <section className="choice-body container is-max-desktop">
                        <div className={`block flexlist is-centered has-${row_limit}-per-row`}>
                            { possibilies }
                        </div>
                    </section>
                    <footer className="choice-footer buttons is-centered">
                        <button className="button is-light" type="button" onClick={() => { setShowInput(false) }}>
                            <span>Back</span>
                        </button>
                    </footer>
                </div>
            </div>
        )
    }

    let icon = <></>
    switch(roll){
        case 4:
            icon = <DiceD4Icon className="svg-white"/>
            break;
        case 6: 
            icon = <DiceD6Icon className="svg-white"/>
            break;
        case 8: 
            icon = <DiceD8Icon className="svg-white"/>
            break;
        case 10: 
            icon = <DiceD10Icon className="svg-white"/>
            break;
        case 12: 
            icon = <DiceD12Icon className="svg-white"/>
            break;
        case 20: 
        default:
            icon = <DiceD20Icon className="svg-white"/>
            break;
    }

    return (
        <div className="choice">
            <div className="choice-background"></div>
            <div className="choice-content">
                <header className="choice-title">
                    {
                        check === 'NA'
                        ? <>
                            <h1 className="title">It's your turn to roll!</h1>
                            <h2 className="subtitle">Roll A D{roll}</h2>
                        </>
                        : <>
                            <h1 className="title is-capitalized">{check} check!</h1>
                            <h2 className="subtitle">Roll A D{roll}</h2>
                        </>
                    }
                </header>
                <section className="choice-body container is-max-desktop">
                    <div className="block is-flex is-flex-direction-column is-align-items-center">
                        <div className="block" style={{ width: '100px' }}>
                            { icon }
                        </div>
                    </div>
                    <div className="block columns">
                        
                        <div className="column">
                            <div className={"box is-clickable " + Styles.ChoiceBox} onClick={autoRoll}>
                                <div className="field icon is-large mx-auto is-block">
                                    <BoltAuto className="" />
                                </div>
                                <p className="is-size-4 has-text-centered">Auto Roll</p>
                            </div>
                        </div>
                        <div className="column">
                            <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setShowInput(true)}>
                                <div className="field icon is-large mx-auto is-block">
                                    <FontAwesomeIcon icon={faDice} size='3x' />
                                </div>
                                <p className="is-size-4 has-text-centered">Roll Myself</p>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    )
}

export function WaitForRoll({ who, onStop, isDungeonMaster=false }){

    return (
        <div className="toast is-top">
            {
                isDungeonMaster
                ? <div className="notification is-black level">
                    <span>{ who.player_name } is rolling...</span>
                    <button className="button is-dark is-small" type="button" onClick={onStop}>
                        <span>Cancel</span>
                    </button>
                </div>
                : <div className="notification is-black has-text-centered">
                    { who.player_name } is rolling...
                </div>
            }
        </div>
    )
}

export function ShowRolledResult({ when:then, roll, who }){

    const [ skip, setSkip ] = useState(false)

    useEffect(() => {
        const listener = function({ key }){
            if(['Escape'].includes(key)){ setSkip(true) }
        }
        document.addEventListener('keydown', listener)
        return () => {
            document.removeEventListener('keydown', listener)
        }
    }, []);

    useEffect(() => {
        let interval = setInterval(() => {
            if(moment(then).add(10, 'seconds').isBefore()){
                setSkip(true)
                clearInterval(interval)
            }
        }, 250)

        return () => {
            try{
                clearInterval(interval)
            } catch(e){}
        }
    }, [then])

    if(skip || moment(then).add(10, 'seconds').isBefore()){
        return <></>
    }

    let player_name = who.player_name
    try{
        player_name = player_name.split(' ')[0]
    } catch(e){  }

    return (
        <div className="choice">
            <div className="choice-background"></div>
            <div className="choice-content">
                <header className="choice-title">
                    <div className="block">
                        <h1 className="title is-size-1 has-text-white">
                            {player_name} rolled a {roll}{
                            roll < 7
                                ? '...'
                            : roll < 18
                                ? '.'
                            : '!'
                        }
                        </h1>
                    </div>
                </header>
                <section className="choice-body container is-max-desktop">
                    <CountdownProgressbar
                        time={10 * 1000}
                        size="large"
                    />
                </section>
                <footer className="choice-footer buttons is-centered">
                    <button className="button is-primary is-medium" type="button" onClick={() => { setSkip(true) }}>
                        {
                            roll < 3
                                ? <span>Oof</span>
                            : roll < 6
                                ? <span>Not bad</span>
                            : roll < 14
                                ? <span>Okay</span>
                            : roll < 18
                                ? <span>Nice!</span>
                            : <span>Awesome!</span>
                        }
                    </button>
                </footer>
            </div>
        </div>
    )
}