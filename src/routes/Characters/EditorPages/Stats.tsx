import { useState } from "react";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandSpock, faHatWizard, faShieldHalved, faStarAndCrescent, faSync, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

// Redux
import { useAppSelector } from "core/redux";

// Common
import ChooseAvatar from "common/ChooseAvatar";

// Hooks
import { changeListener, onKeyDown, update } from 'routes/Characters/forms'

// Misc
import Styles from '../_.module.sass'

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN

const ability_score_modifier_map: { [key: number]: number } = {
    1: -5,
    2: -4,
    3: -4,
    4: -3,
    5: -3,
    6: -2,
    7: -2,
    8: -1,
    9: -1,
    10: 0,
    11: 0,
    12: 1,
    13: 1,
    14: 2,
    15: 2,
    16: 3,
    17: 3,
    18: 4,
    19: 4,
    20: 5,
    21: 5,
    22: 6,
    23: 6,
    24: 7,
    25: 7,
    26: 8,
    27: 8,
    28: 9,
    29: 9,
    30: 10
}

function BigStat({ value, onChange, label }: { value: number, onChange: (event: any) => any, label: string }) {

    let score_modifier: number = ability_score_modifier_map[value] || 0

    if(value > 30){
        score_modifier = 10
    } else if (value < 1){
        score_modifier = 0
    }

    return (
        <div className={"block box " + Styles.BigStat}>
            <label className="box-label is-centered has-text-weight-bold is-capitalized">{label}</label>
            <div className="field">
                <div className="control">
                    <input
                        className="input has-text-centered is-large"
                        value={(score_modifier > 0 ? '+ ' : '') + score_modifier}
                        placeholder=""
                        readOnly
                    />
                </div>
                <div className="control">
                    <input
                        className="input has-text-centered"
                        style={{ backgroundColor: '#f7f7fa' }}
                        type="number"
                        value={value}
                        onKeyDown={onKeyDown}
                        onChange={onChange}
                        placeholder=""
                    />
                </div>
            </div>
        </div>
    )
}

type InlineProps = {
    value: string | number,
    onChange: (event: any) => any,
    label: string
}
function InlineInput({ value, onChange, label="" }: InlineProps) {
    return <div className={'field ' + Styles.inlineInput}>
        <label className="label is-capitalized mb-0">
            <strong>{label}</strong>
        </label>
        <div className="control">
            <input
                className="input"
                type="number"
                onKeyDown={onKeyDown}
                onChange={onChange}
                value={value}
            />
        </div>
    </div>
}

export default function EditorPageOne() {

    const character = useAppSelector(state => state.characters.current)

    const [ showSkillsModal, setShowSkillsModal ] = useState(false)
    const [ showSavingThrowsModal, setShowSavingThrowsModal ] = useState(false)
    const [ showChooseAvatar, setShowChooseAvatar ] = useState(false)

    if(!character){
        return <></>
    }

    let hasStats = false;
    let hasSavingThrows = false;

    return (
        <>
            <div className="block columns">
                
                <div className="column">
                    <div className="field">
                        <label className="label input-label">Character Name</label>
                        <div className="control has-icons-left">
                            <input
                                autoFocus
                                className="input is-medium"
                                value={character.name}
                                onChange={changeListener('name')}
                                onKeyDown={onKeyDown}
                            />
                            <span className="icon is-left">
                                <FontAwesomeIcon icon={faHatWizard}/>
                            </span>
                        </div>
                    </div>
                    <div className="field columns">
                        
                        <div className="column">
                            <div className="field">
                                <label className="label input-label">Class</label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input is-medium"
                                        value={character.features.class}
                                        onChange={changeListener('features.class')}
                                        onKeyDown={onKeyDown}
                                    />
                                    <span className="icon is-left">
                                        <FontAwesomeIcon icon={faShieldHalved}/>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label input-label">Race</label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input is-medium"
                                        value={character.features.race}
                                        onChange={changeListener('features.race')}
                                        onKeyDown={onKeyDown}
                                    />
                                    <span className="icon is-left">
                                        <FontAwesomeIcon icon={faHandSpock}/>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="field">
                                <label className="label input-label">Background</label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input is-medium"
                                        value={character.features.background}
                                        onChange={changeListener('features.background')}
                                        onKeyDown={onKeyDown}
                                    />
                                    <span className="icon is-left">
                                        <FontAwesomeIcon icon={faWandMagicSparkles}/>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label input-label">Alignment</label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input is-medium"
                                        value={character.features.alignment}
                                        onChange={changeListener('features.alignment')}
                                        onKeyDown={onKeyDown}
                                    />
                                    <span className="icon is-left">
                                        <FontAwesomeIcon icon={faStarAndCrescent}/>
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="block box is-clickable" onClick={() => setShowSkillsModal(true)}>
                        <label className="label box-label is-clickable">Skills</label>
                        { Object
                            .entries(character.stats)
                            .map(([ key, value ]: [ key: string, value: number ]) => {
                                if(!value){
                                    return;
                                }
                                if(['strength', 'wisdom', 'dexterity', 'intelligence', 'charisma', 'constitution', 'inspiration', 'proficienyBonus', 'passiveWisdom'].includes(key)){
                                    return;
                                }
                                hasStats = true;
                                return <p key={key} className={"is-size-6 " + Styles.skillDisplay}>
                                    <strong className="is-size-5">+{ value }</strong> { key }
                                </p>
                            })
                        }
                        { !hasStats
                            ? <p>Click to add character stats</p>
                            : <></>
                        }
                    </div>
                    <div className="block box is-clickable" onClick={() => setShowSavingThrowsModal(true)}>
                        <label className="label box-label is-clickable">Saving Throws</label>
                        { Object
                            .entries(character.savingThrows)
                            .map(([ key, value ]: [ key: string, value: number ]) => {
                                if(!value){
                                    return;
                                }
                                hasSavingThrows = true;
                                return <p key={key} className={"is-size-6 " + Styles.skillDisplay}>
                                    <strong className="is-size-5">+{ value }</strong> { key }
                                </p>
                            })
                        }
                        { !hasSavingThrows
                            ? <p>Click to add saving throws</p>
                            : <></>
                        }
                    </div>
                    <div className="block columns">
                        
                        <div className="column">
                            <div className="box">
                                <label className="label box-label">Inspiration</label>
                                <div className="control is-expanded">
                                    <input
                                        className="input"
                                        type="number"
                                        value={character.stats.inspiration}
                                        onChange={changeListener("stats.inspiration")}
                                        onKeyDown={onKeyDown}
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="box">
                                <label className="label box-label">Proficiency Bonus</label>
                                <div className="control is-expanded">
                                    <input
                                        className="input"
                                        type="number"
                                        value={character.stats.proficienyBonus}
                                        onChange={changeListener("stats.proficienyBonus")}
                                        onKeyDown={onKeyDown}
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="box">
                                <label className="label box-label">Passive Wisdom</label>
                                <div className="control is-expanded">
                                    <input
                                        className="input"
                                        type="number"
                                        value={character.stats.passiveWisdom}
                                        onChange={changeListener("stats.passiveWisdom")}
                                        onKeyDown={onKeyDown}
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="column is-one-third">
                    <div className="block box">
                        <label className="label box-label">Character Avatar</label>
                        <figure className="block image is-1by1 mt-3 is-clickable" onClick={() => { setShowChooseAvatar(true) }}>
                            <img src={API_DOMAIN + '/' + character.image} alt="character.name" crossOrigin="anonymous"/>
                        </figure>
                        <div className="block buttons is-centered">
                            <button className="button is-light is-fullwidth" type="button" onClick={() => { setShowChooseAvatar(true) }}>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faSync}/>
                                </span>
                                <span>Change Image</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="block columns">
                <div className="column">
                    <BigStat value={character.stats.strength} onChange={changeListener("stats.strength")} label="strength" />
                </div>
                <div className="column">
                    <BigStat value={character.stats.dexterity} onChange={changeListener("stats.dexterity")} label="dexterity" />
                </div>
                <div className="column">
                    <BigStat value={character.stats.constitution} onChange={changeListener("stats.constitution")} label="constitution" />
                </div>
                <div className="column">
                    <BigStat value={character.stats.intelligence} onChange={changeListener("stats.intelligence")} label="intelligence" />
                </div>
                <div className="column">
                    <BigStat value={character.stats.wisdom} onChange={changeListener("stats.wisdom")} label="wisdom" />
                </div>
                <div className="column">
                    <BigStat value={character.stats.charisma} onChange={changeListener("stats.charisma")} label="charisma" />
                </div>
            </div>
            { showSkillsModal 
                ? <div className="modal is-active">
                    <div className="modal-background" onClick={() => { setShowSkillsModal(false) }}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Skills</p>
                            <button className="delete" onClick={() => { setShowSkillsModal(false) }}></button>
                        </header>
                        <section className="modal-card-body">
                            <div className="block columns">
                                
                                <div className="column">
                                    <InlineInput label="acrobatics (Dex)"       onChange={changeListener('stats.acrobatics', true)}     value={character.stats['acrobatics']}     />
                                    <InlineInput label="animal handling (Wis)"  onChange={changeListener('stats.animalHandling', true)} value={character.stats['animalHandling']} />
                                    <InlineInput label="arcana (Int)"           onChange={changeListener('stats.arcana', true)}         value={character.stats['arcana']}         />
                                    <InlineInput label="athletics (Str)"        onChange={changeListener('stats.athletics', true)}      value={character.stats['athletics']}      />
                                    <InlineInput label="deception (Cha)"        onChange={changeListener('stats.deception', true)}      value={character.stats['deception']}      />
                                    <InlineInput label="history (Int)"          onChange={changeListener('stats.history', true)}        value={character.stats['history']}        />
                                    <InlineInput label="insight (Wis)"          onChange={changeListener('stats.insight', true)}        value={character.stats['insight']}        />
                                    <InlineInput label="intimidation (Cha)"     onChange={changeListener('stats.intimidation', true)}   value={character.stats['intimidation']}   />
                                    <InlineInput label="investigation (Int)"    onChange={changeListener('stats.investigation', true)}  value={character.stats['investigation']}  />
                                </div>
                                <div className="column">
                                    <InlineInput label="medicine (Wis)"         onChange={changeListener('stats.medicine', true)}       value={character.stats['medicine']}       />
                                    <InlineInput label="nature (Int)"           onChange={changeListener('stats.nature', true)}         value={character.stats['nature']}         />
                                    <InlineInput label="perception (Wis)"       onChange={changeListener('stats.perception', true)}     value={character.stats['perception']}     />
                                    <InlineInput label="performance (Cha)"      onChange={changeListener('stats.performance', true)}    value={character.stats['performance']}    />
                                    <InlineInput label="persuasion (Cha)"       onChange={changeListener('stats.persuasion', true)}     value={character.stats['persuasion']}     />
                                    <InlineInput label="religion (Int)"         onChange={changeListener('stats.religion', true)}       value={character.stats['religion']}       />
                                    <InlineInput label="sleight Of Hand (Dex)"  onChange={changeListener('stats.sleightOfHand', true)}  value={character.stats['sleightOfHand']}  />
                                    <InlineInput label="stealth (Dex)"          onChange={changeListener('stats.stealth', true)}        value={character.stats['stealth']}        />
                                    <InlineInput label="survival (Wis)"         onChange={changeListener('stats.survival', true)}       value={character.stats['survival']}       />
                                </div>
                                
                            </div>
                        </section>
                        <footer className="modal-card-foot buttons is-right">
                            <button className="button" type="button" onClick={() => { setShowSkillsModal(false) }}>
                                <span>Close</span>
                            </button>
                        </footer>
                    </div>
                </div>
                : <></>
            }
            { showSavingThrowsModal 
                ? <div className="modal is-active">
                    <div className="modal-background" onClick={() => { setShowSavingThrowsModal(false) }}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Saving Throws</p>
                            <button className="delete" onClick={() => { setShowSavingThrowsModal(false) }}></button>
                        </header>
                        <section className="modal-card-body">
                            <InlineInput label="strength"     onChange={changeListener('savingThrows.strength', true)}     value={character.savingThrows.strength}     />
                            <InlineInput label="dexterity"    onChange={changeListener('savingThrows.dexterity', true)}    value={character.savingThrows.dexterity}    />
                            <InlineInput label="constitution" onChange={changeListener('savingThrows.constitution', true)} value={character.savingThrows.constitution} />
                            <InlineInput label="intelligence" onChange={changeListener('savingThrows.intelligence', true)} value={character.savingThrows.intelligence} />
                            <InlineInput label="wisdom"       onChange={changeListener('savingThrows.wisdom', true)}       value={character.savingThrows.wisdom}       />
                            <InlineInput label="charisma"     onChange={changeListener('savingThrows.charisma', true)}     value={character.savingThrows.charisma}     />
                        </section>
                        <footer className="modal-card-foot buttons is-right">
                            <button className="button" type="button" onClick={() => { setShowSavingThrowsModal(false) }}>
                                <span>Close</span>
                            </button>
                        </footer>
                    </div>
                </div>
                : <></>
            }
            { showChooseAvatar
                ? <ChooseAvatar current={character.image} onChoose={(image) => {
                    if(image){
                        image = image.replaceAll(API_DOMAIN, '')
                        update('image', image)
                    }
                    setShowChooseAvatar(false)
                }}/>
                : <></>
            }
        </>
    )
}
