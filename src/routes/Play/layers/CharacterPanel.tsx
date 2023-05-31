
// Types
import type { CurrentCharacter } from 'redux/campaigns/types.js';

// Icons
// import { faShield } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Redux
import { dispatch, useAppSelector } from 'core/redux.js';
import { setReducerState, toggleModal } from 'redux/play/reducer.js';

// Utility
import { startCase } from 'lodash-es';

// UI
import { InventoryList } from '../Modals/Inventory.js';
import Healthbar from '../components/Healthbar.js'

import Styles from '../_.module.sass'

export default function CharacterPanel() {

    const myCharacter = useAppSelector(state => state.play.myCharacter)
    const previewCharacter = useAppSelector(state => state.play.previewCharacter)

    const isPreview = !!previewCharacter
    const character = previewCharacter || myCharacter

    if(!character || !character?.name){ 
        return <></>
    }

    return <div className={Styles.CharacterPanel}>
        <CharacterInfo character={character} isPreview={isPreview} />
        <div className="box pt-3">
            <label className="label">{isPreview ? `${character.name}'s ` : ''}Inventory: </label>
            <InventoryList playerId={character.id} isCompact onClick={(slotId) => {
                dispatch(
                    setReducerState({
                        path: 'modalMeta',
                        value: {
                            playerId: character.id,
                            startState: {
                                mode: 'edit',
                                editingSlot: slotId
                            }
                        }
                    })
                )
                dispatch(
                    toggleModal('inventory')
                )
            }} />
        </div>
    </div>
}

function CharacterInfo({ character, isPreview, }: { character: CurrentCharacter, isPreview: boolean }){

    const {
        current: {
            health=0,
            maxHealth=0,
            armorClass
        }={}
    } = character

    return (<div className={Styles.container}>
        { isPreview 
            ? <div className={Styles.isPreview} onClick={() => {
                dispatch(setReducerState({ path: 'previewCharacter', value: null }))
            }}>
                <span className="tag is-primary is-clickable">
                    Viewing { character.name }'s Character
                    <button className="delete is-small"></button>
                </span>
            </div>
            : <></>
        }
        
        <BigStats character={character} />
        <div className="block columns">
            
            <div className="column is-1 is-paddingless">
                <div className={Styles.ArmorClass}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M466.5 83.71l-192-80.01c-4.875-2.031-13.17-3.701-18.46-3.701c-5.312 0-13.53 1.67-18.44 3.701L45.61 83.71C27.7 91.1 16 108.6 16 127.1C16 385.2 205.2 512 255.1 512C307.1 512 496 383.8 496 127.1C496 108.6 484.3 91.1 466.5 83.71zM255.1 496C212.1 496 32 374 32 127.1c0-12.99 7.732-24.57 19.75-29.53l191.1-79.99C246.7 17.21 252.8 16 256.1 16c3.184 0 9.381 1.232 12.28 2.441l192 80.02C472.3 103.4 480 114.1 480 127.1C480 405.6 270.9 496 255.1 496z"/>
                    </svg>
                    <label className="label">{armorClass}</label>
                </div>
            </div>
            <div className="column">
                <Healthbar current={health} max={maxHealth}/>
                <Healthbar current={2} max={3} color="is-link"/>
            </div>
            
        </div>
    </div>)
}

export function BigStats({ character, className }:{ character: CurrentCharacter, className?: string }){
    const {
        strength, dexterity, charisma, wisdom, intelligence, constitution,
        strengthAdd, dexterityAdd, charismaAdd, wisdomAdd, intelligenceAdd, constitutionAdd,
        ...otherStats
    } = character.stats

    return <div className={`block columns is-gapless ${Styles.Stats} ${className}`}>
        <div className="column">
            <BigStat label="Strength" small={strength} big={strengthAdd} />
        </div>
        <div className="column">
            <BigStat label="Dexterity" small={dexterity} big={dexterityAdd} />
        </div>
        <div className="column">
            <BigStat label="Charisma" small={charisma} big={charismaAdd} />
        </div>
        <div className="column">
            <BigStat label="Wisdom" small={wisdom} big={wisdomAdd} />
        </div>
        <div className="column">
            <BigStat label="Intelligence" small={intelligence} big={intelligenceAdd} />
        </div>
        <div className="column">
            <BigStat label="Constitution" small={constitution} big={constitutionAdd} />
        </div>
        <div className="column is-3">
            <div className={"px-2 " + Styles.statList}>
                { Object
                    .entries(otherStats)
                    .map(([ key, value ]) => {
                        if(!value){
                            return;
                        }
                        const unaryOperator = value > 0 ? '+' : '-'
                        return <p key={key}>{ unaryOperator } { value } { startCase(key) }</p>
                    })
                }
            </div>
        </div>
    </div>
}

type BigStatProps = {
    big: number,
    small: number,
    label: string
}
function BigStat({ big, small, label }: BigStatProps){
    return <>
        <div className="box has-text-centered">
            <p className="is-size-3 has-text-weight-bold">{ small >=0 ? '+' : '-' } { small }</p>
            <p className="is-size-6">{ big }</p>
        </div>
        <label className="label has-text-centered is-capitalized">{ label }</label>
    </>
}
