import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandSpock, faHatWizard, faShieldHalved, faStarAndCrescent, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

import Styles from '../_.module.sass'

const ability_score_modifier_map = {
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

function listenForKeydown({ key, target }) {
    if (['Enter', 'Esc', 'Escape'].includes(key)) {
        console.log("Blurring due to Enter or Escape key pressed")
        target.blur()
    }
}

function BigStat({ value, character, save, changeListener }) {
    let v = character.stats[value]
    v = parseInt(v)

    let ability_score_modifier = isNaN(v) || !v
        ? 0
        : v > 30
        ? 10
        : v < 1
        ? 0
        : ability_score_modifier_map[v]

    return (
        <div className={"block box " + Styles.BigStat}>
            <label className="box-label is-centered has-text-weight-bold is-capitalized">{value}</label>
            <div className="field">
                <div className="control">
                    <input
                        className="input has-text-centered is-large"
                        type="number"
                        value={v}
                        onKeyDown={listenForKeydown}
                        onChange={changeListener('stats.'+value)}
                        onBlur={() => save({}, true)}
                        placeholder=""
                    />
                </div>
                <div className="control">
                    <input
                        className="input has-text-centered"
                        // type="number"
                        // value={'+ ' + character.stats[value+'Add']}
                        value={'+ ' + ability_score_modifier}
                        // onKeyDown={listenForKeydown}
                        // onChange={changeListener('stats.'+value+'Add')}
                        // onBlur={() => save({}, true)}
                        placeholder=""
                        readOnly
                    />
                </div>
            </div>
        </div>
    )
}

function InlineInput({ value_1, value_2, text="", character, changeListener, save }) {
    return <div className={'field ' + Styles.inlineInput}>
        <label className="label is-capitalized mb-0">{value_2}{<strong> {text}</strong>}</label>
        <div className="control">
            <input
                className="input"
                type="number"
                onKeyDown={listenForKeydown}
                onChange={changeListener(`${value_1}.${value_2}`, true, true)}
                value={character[value_1][value_2]}
                onBlur={() => {
                    save({}, true)
                }}
            />
        </div>
    </div>
}

export default function EditorPageOne({ character, save }) {

    const [showSkillsModal, setShowSkillsModal] = useState(false)
    const [showSavingThrowsModal, setShowSavingThrowsModal] = useState(false)
    
    function changeListener(key, is_integer=false, save_to_db=false) {
        return function ({ target: { value } }) {
            let k = {};
            if(is_integer){ value = parseInt(value) }
            k[key] = value;
            save(k, save_to_db);
        }
    }
    
    return (
        <>
            <div className="block columns">
                
                <div className="column">
                    <div className="field">
                        <label className="label input-label">Character Name</label>
                        <div className="control has-icons-left">
                            <input
                                className="input is-medium"
                                value={character.name}
                                onChange={changeListener('name')}
                                onKeyDown={listenForKeydown}
                                onBlur={() => save({}, true)}
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
                                        onKeyDown={listenForKeydown}
                                        onBlur={() => save({}, true)}
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
                                        onKeyDown={listenForKeydown}
                                        onBlur={() => save({}, true)}
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
                                        onKeyDown={listenForKeydown}
                                        onBlur={() => save({}, true)}
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
                                        onKeyDown={listenForKeydown}
                                        onBlur={() => save({}, true)}
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
                        { Object.keys(character.stats)
                            .filter(key => {
                                let value = character.stats[key]
                                return (!['strength', 'wisdom', 'dexterity', 'intelligence', 'charisma', 'constitution', 'inspiration', 'proficienyBonus', 'passiveWisdom'].includes(key) && value)
                            })
                            .map(key => {
                                let value = character.stats[key]
                                return <p className={"is-size-6 " + Styles.skillDisplay} key={key}><strong className="is-size-5">+{value}</strong> {key}</p>
                            })
                        }
                    </div>
                    <div className="block box is-clickable" onClick={() => setShowSavingThrowsModal(true)}>
                        <label className="label box-label is-clickable">Saving Throws</label>
                        { Object.keys(character.savingThrows)
                            .filter(key => !!character.savingThrows[key])
                            .map(key => {
                                let value = character.savingThrows[key]
                                return <p className={"is-size-6 " + Styles.skillDisplay} key={key}><strong className="is-size-5">+{value}</strong> {key}</p>
                            })
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
                                        onKeyDown={listenForKeydown}
                                        onBlur={() => {
                                            save({}, true)
                                        }}
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
                                        onKeyDown={listenForKeydown}
                                        onBlur={() => {
                                            save({}, true)
                                        }}
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
                                        onKeyDown={listenForKeydown}
                                        onBlur={() => {
                                            save({}, true)
                                        }}
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="column">
                    <div className="block box is-flex is-justify-content-center is-align-items-center" style={{ height: '100%' }}>
                        <h1 className="title has-text-centered" style={{ opacity:'0.2' }} onClick={() => console.log(character)}>More Coming Soon</h1>
                    </div>
                </div>
            </div>

            <div className="block columns">
                <div className="column">
                    <BigStat value="strength" character={character} changeListener={changeListener} save={save}/>
                </div>
                <div className="column">
                    <BigStat value="dexterity" character={character} changeListener={changeListener} save={save}/>
                </div>
                <div className="column">
                    <BigStat value="constitution" character={character} changeListener={changeListener} save={save}/>
                </div>
                <div className="column">
                    <BigStat value="intelligence" character={character} changeListener={changeListener} save={save}/>
                </div>
                <div className="column">
                    <BigStat value="wisdom" character={character} changeListener={changeListener} save={save}/>
                </div>
                <div className="column">
                    <BigStat value="charisma" character={character} changeListener={changeListener} save={save}/>
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
                                        <InlineInput value_1="stats" value_2="acrobatics"     text="(Dex)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="animal Handling"text="(Wis)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="arcana"         text="(Int)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="athletics"      text="(Str)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="deception"      text="(Cha)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="history"        text="(Int)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="insight"        text="(Wis)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="intimidation"   text="(Cha)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="investigation"  text="(Int)" character={character} changeListener={changeListener} save={save}/>
                                    </div>
                                    <div className="column">
                                        <InlineInput value_1="stats" value_2="medicine"       text="(Wis)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="nature"         text="(Int)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="perception"     text="(Wis)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="performance"    text="(Cha)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="persuasion"     text="(Cha)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="religion"       text="(Int)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="sleight Of Hand"text="(Dex)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="stealth"        text="(Dex)" character={character} changeListener={changeListener} save={save}/>
                                        <InlineInput value_1="stats" value_2="survival"       text="(Wis)" character={character} changeListener={changeListener} save={save}/>
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
                                <InlineInput value_1="savingThrows" value_2="strength"     character={character} changeListener={changeListener} save={save} />
                                <InlineInput value_1="savingThrows" value_2="dexterity"    character={character} changeListener={changeListener} save={save} />
                                <InlineInput value_1="savingThrows" value_2="constitution" character={character} changeListener={changeListener} save={save} />
                                <InlineInput value_1="savingThrows" value_2="intelligence" character={character} changeListener={changeListener} save={save} />
                                <InlineInput value_1="savingThrows" value_2="wisdom"       character={character} changeListener={changeListener} save={save} />
                                <InlineInput value_1="savingThrows" value_2="charisma"     character={character} changeListener={changeListener} save={save} />
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
        </>
    )
}