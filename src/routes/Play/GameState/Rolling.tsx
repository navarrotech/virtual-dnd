import { useState, useEffect } from 'react'

// Typescript
import type { AskToRoll, DiceRoll, GameState } from "redux/campaigns/types"

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as DiceD4Icon } from 'icons/dice-d4.svg'
import { ReactComponent as DiceD6Icon } from 'icons/dice-d6.svg'
import { ReactComponent as DiceD8Icon } from 'icons/dice-d8.svg'
import { ReactComponent as DiceD10Icon } from 'icons/dice-d10.svg'
import { ReactComponent as DiceD12Icon } from 'icons/dice-d12.svg'
import { ReactComponent as DiceD20Icon } from 'icons/dice-d20.svg'

import { ReactComponent as BoltAuto } from 'icons/bolt-auto.svg'

// Common
import CountdownProgressbar from 'common/CountdownProgressbar'

// Utility
import { GameStateModal } from "./utils"
import moment from 'moment'

// Redux
import { useAppSelector } from "core/redux"

import Styles from '../_.module.sass'
import { updateViaSocket } from '../socket'

const IconMap = {
    'd4':   <DiceD4Icon  className="svg-white"/>,
    'd6':   <DiceD6Icon  className="svg-white"/>,
    'd8':   <DiceD8Icon  className="svg-white"/>,
    'd10':  <DiceD10Icon className="svg-white"/>,
    'd12':  <DiceD12Icon className="svg-white"/>,
    'd20':  <DiceD20Icon className="svg-white"/>,
    'd50':  <DiceD20Icon className="svg-white"/>,
    'd100': <DiceD20Icon className="svg-white"/>,
}

export default function Rolling() {
    const userId = useAppSelector(state => state.user.user.id)
    const gamestate = useAppSelector(state => state.play.gamestate.data) as AskToRoll

    const { dice, who, reason } = state

    // Am I being asked to roll, or am I watching someone else roll?
    if(who[userId] && who[userId].result === null){
        return <RollDice dice={dice} reason={reason} />
    }

    // If I am watching someone else roll, if it's one person just show a banner at the top
    // If I am watching two people roll, go fullscreen with one person on each side
    // If I am watching more than 3 people, show fullscreen with all of them spinning slowly in a neat animation



    return <GameStateModal>
        <div className="modal-card">
            <h1 className="title has-text-white">Here</h1>
        </div>
    </GameStateModal>
}

function SinglePersonRolling(){
    return <GameStateModal>
        <div className="modal-card">
            <h1 className="title has-text-white">One person is rolling!</h1>
        </div>
    </GameStateModal>
}


export function RollDice({ dice='d20', reason='other' }:{ dice: DiceRoll, reason: AskToRoll['reason'] }){
    const userId = useAppSelector(state => state.user.user.id)
    const gamestate = useAppSelector(state => state.play.gamestate)

    const [ showInput, setShowInput ] = useState(false)

    const diceAsNumber = parseInt(dice.replace('d', ''))

    function onRolled(roll: number){
        const newGamestate = { ...gamestate }

        newGamestate.data.who[userId].result = 'd' + roll
        newGamestate.data.who[userId].when = moment().toISOString()

        updateViaSocket('gamestate', newGamestate)
    }

    function autoRoll(){
        onRolled(
            1 + Math.floor(Math.random() * (diceAsNumber-1))
        )
    }

    if(showInput){
        const possibilities = []
        for (let i = 0; i < diceAsNumber; i++) {
                possibilities.push(<div key={i} className={"item box is-clickable has-text-centered mb-0 " + Styles.ChoiceBox} onClick={() => onRolled(i+1)}>
                <h1 className="title">{i+1}</h1>
            </div>)
        }

        let row_limit = 5
        if(diceAsNumber === 4 || diceAsNumber === 8){ row_limit = 4 }
        else if(diceAsNumber === 6 || diceAsNumber === 12){ row_limit = 6 }

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
                            { possibilities }
                        </div>
                    </section>
                    <footer className="choice-footer buttons is-centered">
                        <button className="button is-light" type="button" onClick={() => setShowInput(false)}>
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
                <header className="choice-title">{
                    !reason || reason === 'other'
                        ? <h1 className="title">It's your turn to roll!</h1>
                        : <h1 className="title is-capitalized">Roll for {reason}!</h1>
                }
                    <h2 className="subtitle is-capitalized">Roll A {dice}</h2>
                </header>
                <section className="choice-body container is-max-desktop">
                    <div className="block is-flex is-flex-direction-column is-align-items-center">
                        <div className="block" style={{ width: '100px' }}>
                            { IconMap[dice] }
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

export function WaitForRollBadge({ who, onStop, isDungeonMaster=false }){

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
