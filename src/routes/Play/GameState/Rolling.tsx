import { useState, useEffect } from 'react'

// Typescript
import type { AskToRoll, DiceRoll, GameState } from "redux/campaigns/types"

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as DiceD4Icon } from 'images/icons/dice-d4.svg'
import { ReactComponent as DiceD6Icon } from 'images/icons/dice-d6.svg'
import { ReactComponent as DiceD8Icon } from 'images/icons/dice-d8.svg'
import { ReactComponent as DiceD10Icon } from 'images/icons/dice-d10.svg'
import { ReactComponent as DiceD12Icon } from 'images/icons/dice-d12.svg'
import { ReactComponent as DiceD20Icon } from 'images/icons/dice-d20.svg'

import { ReactComponent as BoltAuto } from 'images/icons/bolt-auto.svg'

// Common
import CountdownProgressbar from 'common/CountdownProgressbar'

// Utility
import { GameStateModal } from "./utils"
import moment from 'moment'

// Redux
import { useAppSelector } from "core/redux"

import Styles from '../_.module.sass'
import LocalStyles from './Rolling.module.sass'
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

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN as string + '/'

export default function Rolling() {
    const userId = useAppSelector(state => state.user.user.id)
    const gamestate = useAppSelector(state => state.play.gamestate.data) as AskToRoll

    const { dice, who, reason } = gamestate

    // Is the gamestate finished? (Backend needs to dictate it)
    // If so, show the countdown progressbar + results
    // Then backend will have a setTimeout to reset the state back to passive.

    // Am I being asked to roll, or am I watching someone else roll?
    if(who[userId] && who[userId].result === null){
        return <GameStateModal key={userId + '-is-rolling'}>
            <RollDice dice={dice} reason={reason} />
        </GameStateModal>
    }

    const whoList = Object.values(who)
    let rollingClass = LocalStyles['has-many-players']
    if(whoList.length === 1){
        rollingClass = LocalStyles['has-1-players']
    } else if(whoList.length === 2){
        rollingClass = LocalStyles['has-2-players']
    }

    return <GameStateModal key={'watch-rolling'}>
        <div className="choice-content">
            <header className="block choice-title">
                <div className="block is-flex is-flex-direction-column is-align-items-center">
                    <div className="block" style={{ width: '125px' }}>
                        { IconMap[dice] }
                    </div>
                </div>
                <h1 className="title">Waiting for players to roll dice...</h1>
            </header>
            <section className="choice-body mt-2">
                <div className={`${LocalStyles.WatchPlayersRoll} ${rollingClass}`}>{
                    whoList.map(who => <WatchPersonRoll key={who.playerId} who={who} />)
                }</div>
            </section>
        </div>
    </GameStateModal>
}

function WatchPersonRoll({ who }: { who: AskToRoll['who'][0] }){
    const player = useAppSelector(state => state.play.players[who.playerId])
    const character = useAppSelector(state => state.play.characters[who.characterId])

    if(!player || !character){
        return <></>
    }

    const { result } = who

    const playerName = player.first_name + ' ' + player.last_name

    return <div className={LocalStyles.RollingPlayer}>
        <figure className="image is-centered">
            <img src={API_DOMAIN + (character.image || player.photoURL)} alt={playerName} crossOrigin="anonymous"/>
        </figure>
        <h1 className="title">{ character.name  }</h1>
        <h2 className="subtitle">({ playerName })</h2>
        { !result
            ? <div className={LocalStyles.RollingStatus}>Is Rolling...</div>
            : <div className={LocalStyles.RollingStatus + " tag is-primary is-large"}>Rolled a { result }!</div>
        }
    </div>
}

export function RollDice({ dice='d20', reason='other' }:{ dice: DiceRoll, reason: AskToRoll['reason'] }){
    const userId = useAppSelector(state => state.user.user.id)
    const gamestate = useAppSelector(state => state.play.gamestate)

    const [ showInput, setShowInput ] = useState(false)

    const diceAsNumber = parseInt(dice.replace('d', ''))

    function onRolled(roll?: number){
        if(roll === undefined){
            roll = 1 + Math.floor(Math.random() * (diceAsNumber-1))
        }

        const newGamestate = {
            ...gamestate,
            data: {
                ...gamestate.data,
                who: {
                    ...gamestate.data.who,
                    [userId]: {
                        ...gamestate.data.who[userId],
                        result: 'd' + roll,
                        when: moment().toISOString()
                    }
                }
            }
        }

        updateViaSocket('gamestate', newGamestate)
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
        )
    }

    return (
        <div className="choice-content">
            <header className="choice-title">{
                !reason || reason === 'other'
                    ? <h1 className="title">It's your turn to roll!</h1>
                    : <h1 className="title is-capitalized">Roll for {reason}!</h1>
            }
                <div className="block is-flex is-flex-direction-column is-align-items-center">
                    <div className="block" style={{ width: '150px' }}>
                        { IconMap[dice] }
                    </div>
                </div>
                <h2 className="subtitle is-capitalized">Roll A { dice }</h2>
            </header>
            <section className="choice-body container is-max-desktop">
                <div className="block columns">
                    
                    <div className="column">
                        <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => onRolled()}>
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
    )
}

// export function ShowRolledResult({ when:then, roll, who }){

//     const [ skip, setSkip ] = useState(false)

//     useEffect(() => {
//         const listener = function({ key }){
//             if(['Escape'].includes(key)){ setSkip(true) }
//         }
//         document.addEventListener('keydown', listener)
//         return () => {
//             document.removeEventListener('keydown', listener)
//         }
//     }, []);

//     useEffect(() => {
//         let interval = setInterval(() => {
//             if(moment(then).add(10, 'seconds').isBefore()){
//                 setSkip(true)
//                 clearInterval(interval)
//             }
//         }, 250)

//         return () => {
//             try{
//                 clearInterval(interval)
//             } catch(e){}
//         }
//     }, [then])

//     if(skip || moment(then).add(10, 'seconds').isBefore()){
//         return <></>
//     }

//     let player_name = who.player_name
//     try{
//         player_name = player_name.split(' ')[0]
//     } catch(e){  }

//     return (
//         <div className="choice">
//             <div className="choice-background"></div>
//             <div className="choice-content">
//                 <header className="choice-title">
//                     <div className="block">
//                         <h1 className="title is-size-1 has-text-white">
//                             {player_name} rolled a {roll}{
//                             roll < 7
//                                 ? '...'
//                             : roll < 18
//                                 ? '.'
//                             : '!'
//                         }
//                         </h1>
//                     </div>
//                 </header>
//                 <section className="choice-body container is-max-desktop">
//                     <CountdownProgressbar
//                         time={10 * 1000}
//                         size="large"
//                     />
//                 </section>
//                 <footer className="choice-footer buttons is-centered">
//                     <button className="button is-primary is-medium" type="button" onClick={() => { setSkip(true) }}>
//                         {
//                             roll < 3
//                                 ? <span>Oof</span>
//                             : roll < 6
//                                 ? <span>Not bad</span>
//                             : roll < 14
//                                 ? <span>Okay</span>
//                             : roll < 18
//                                 ? <span>Nice!</span>
//                             : <span>Awesome!</span>
//                         }
//                     </button>
//                 </footer>
//             </div>
//         </div>
//     )
// }
