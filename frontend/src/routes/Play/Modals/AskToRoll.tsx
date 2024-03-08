import { useState } from 'react'

// Typescript
import type { ModalProps } from '.'
import type { DiceRoll, AskToRoll as AskToRollPrompt, GameState } from 'redux/campaigns/types'

// Icons
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactComponent as DiceD4Icon } from 'images/icons/dice-d4.svg'
import { ReactComponent as DiceD6Icon } from 'images/icons/dice-d6.svg'
import { ReactComponent as DiceD8Icon } from 'images/icons/dice-d8.svg'
import { ReactComponent as DiceD10Icon } from 'images/icons/dice-d10.svg'
import { ReactComponent as DiceD12Icon } from 'images/icons/dice-d12.svg'
import { ReactComponent as DiceD20Icon } from 'images/icons/dice-d20.svg'

// Redux
import { useAppSelector } from 'core/redux'

// Utility
import { updateViaSocket } from "routes/Play/socket";

import Styles from '../_.module.sass'

type State = {
    page: 0 | 1 | 2,
} & AskToRollPrompt

type PageProps = {
    state: State,
    close: () => void,
    setPage: (page: 0 | 1 | 2, newState?: object) => void
}

const pages = {
    0: SelectWho,
    1: SelectDice,
    2: SelectReason
}

export default function AskToRoll({ close }: ModalProps){
  
    const [ state, setState ] = useState({
        page: 0,
        dice: 'd20',
        who: {},
        reason: ''
    } as State)

    const Page = pages[state.page]

    return <div className="choice-content">
        <Page state={state} close={close} setPage={(page, newState={}) => setState({ ...state, ...newState, page })} />
    </div>
}

function SelectWho({ state, setPage, close }: PageProps){
    const characters = useAppSelector(state => state.play.characters)
    const players = useAppSelector(state => state.play.players)

    const [ selection, setSelection ] = useState(Object.keys(state.who) || [] as string[])

    function toggleCharacter(characterId: string){
        if(selection.includes(characterId)){
            setSelection(selection.filter(k => k !== characterId))
        } else {
            setSelection([ ...selection, characterId ])
        }
    }

    return <>
        <header className="choice-title">
            <h1 className="title">Who do you want to roll?</h1>
        </header>
        <section className="choice-body container is-max-desktop">
            <div className={"block flexlist has-3-per-row is-centered"}>{
                Object
                    .entries(characters)
                    .map(([ characterId, character ]) => <div 
                        key={characterId} 
                        className={`item box is-clickable has-text-centered ${Styles.ChoiceBox} ${selection.includes(characterId) ? 'is-primary' : ''}`} 
                        onClick={() => toggleCharacter(characterId)}
                    >
                        <h1 className={`title ${selection.includes(characterId) ? 'has-text-white' : ''}`}>{
                            players[character.player_id]?.first_name + ' ' + players[character.player_id]?.last_name
                        }</h1>
                        <h2 className={`subtitle ${selection.includes(characterId) ? 'has-text-white' : ''}`}>({
                            character.name
                        })</h2>
                    </div>
                )
            }</div>
        </section>
        <footer className="choice-footer buttons is-centered">
            <button
                className="button is-primary"
                type="button"
                onClick={() => {
                    const who = selection.reduce((obj, characterId) => {
                        const playerId = characters[characterId].player_id
                        obj[playerId] = {
                            playerId,
                            characterId,
                            result: null,
                            when: ''
                        }
                        return obj
                    }, {} as AskToRollPrompt['who'])
                    setPage(1, { who })
                }}
                disabled={!selection.length}
            >
                <span>Select Characters</span>
                <span className="icon">
                    <FontAwesomeIcon icon={faArrowRight}/>
                </span>
            </button>
            <button className="button is-light" type="button" onClick={() => close()}>
                <span>Cancel</span>
            </button>
        </footer>
    </>
}

function SelectDice({ setPage }: PageProps){

    function setDice(dice: DiceRoll){
        setPage(2, { dice })
    }

    return <>
        <header className="choice-title">
            <h1 className="title">What dice should they roll?</h1>
        </header>
        <section className="choice-body container is-max-desktop">
            <div className="block columns">
                
                <div className="column">
                    <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('d4')}>
                        <div className="field icon is-large mx-auto is-block">
                            <DiceD4Icon className="" />
                        </div>
                        <p className="is-size-4 has-text-centered">D4</p>
                    </div>
                    <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('d12')}>
                        <div className="field icon is-large mx-auto is-block">
                            <DiceD12Icon className="" />
                        </div>
                        <p className="is-size-4 has-text-centered">D12</p>
                    </div>
                </div>
                <div className="column">
                    <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('d6')}>
                        <div className="field icon is-large mx-auto is-block">
                            <DiceD6Icon className="" />
                        </div>
                        <p className="is-size-4 has-text-centered">D6</p>
                    </div>
                    <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('d20')}>
                        <div className="field icon is-large mx-auto is-block">
                            <DiceD20Icon className="" />
                        </div>
                        <p className="is-size-4 has-text-centered">D20</p>
                    </div>
                </div>
                <div className="column">
                    <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('d8')}>
                        <div className="field icon is-large mx-auto is-block">
                            <DiceD8Icon className="" />
                        </div>
                        <p className="is-size-4 has-text-centered">D8</p>
                    </div>
                    <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('d50')}>
                        <div className="field icon is-large mx-auto is-block">
                            <DiceD20Icon className="" />
                        </div>
                        <p className="is-size-4 has-text-centered">D50</p>
                    </div>
                </div>
                <div className="column">
                    <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('d10')}>
                        <div className="field icon is-large mx-auto is-block">
                            <DiceD10Icon className="" />
                        </div>
                        <p className="is-size-4 has-text-centered">D10</p>
                    </div>
                    <div className={"box is-clickable " + Styles.ChoiceBox} onClick={() => setDice('d100')}>
                        <div className="field icon is-large mx-auto is-block">
                            <DiceD20Icon className="" />
                        </div>
                        <p className="is-size-4 has-text-centered">D100</p>
                    </div>
                </div>
                
            </div>
        </section>
        <footer className="choice-footer buttons is-centered">
            <button className="button is-light is-medium" type="button" onClick={() => setPage(0, { dice: '' })}>
                <span>Back</span>
            </button>
        </footer>
    </>
}

function SelectReason({ setPage, state, close }: PageProps){

    function finish(value:AskToRollPrompt['reason']='other'){
        updateViaSocket('gamestate', {
            mode: 'rolling',
            isFinished: false,
            finishedAt: null,
            data: {
                dice: state.dice,
                who: state.who,
                reason: value
            }
        } as GameState<AskToRollPrompt>)
        close()
    }

    function Option({ value }:{ value: AskToRollPrompt['reason'] }){
        return <div 
            className={`item box is-clickable has-text-centered ${Styles.ChoiceBox}`} 
            onClick={() => finish(value)}
        >
            <h1 className="title is-capitalized">{ value }</h1>
        </div>
    }

    return <>
        <header className="choice-title">
            <h1 className="title">Reason for roll:</h1>
        </header>
        <section className="choice-body container is-max-widescreen">
            <div className="block columns">
                
                <div className="column">
                    <Option value="damage" />
                    <Option value="initiative" />
                </div>
                <div className="column">
                    <Option value="ability" />
                    <Option value="skill" />
                </div>
                <div className="column">
                    <Option value="save" />
                    <Option value="other" />
                </div>

            </div>
        </section>
        <footer className="choice-footer buttons is-centered are-medium">
            <button className="button is-light" type="button" onClick={() => setPage(1)}>
                <span>Back</span>
            </button>
            <button className="button is-primary" type="button" onClick={() => finish('other')}>
                <span>Skip</span>
            </button>
        </footer>
    </>
}
