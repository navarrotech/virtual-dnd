import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandSpock, faHatWizard, faShieldHalved, faStarAndCrescent, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

import Styles from '../_.module.sass'

function listenForKeydown({ key, target }) {
    if (key === "Enter" || key === "Esc") {
        target.blur()
    }
}
export default function EditorPageOne({ character, save }) {

    const [showSkillsModal, setShowSkillsModal] = useState(false)
    const [showSavingThrowsModal, setShowSavingThrowsModal] = useState(false)
    
    function changeListener(key) {
        return function ({ target: { value } }) {
            let k = {}; k[key] = value; save(k, false);
        }
    }

    function BigStat({ value }) {
        return (
            <div className={"block " + Styles.BigStat}>
                <div className="field">
                    <label className="label is-capitalized">{value}</label>
                    <div className="control">
                        <input
                            className="input has-text-centered is-large"
                            type="number"
                            value={character.stats[value]}
                            onKeyDown={listenForKeydown}
                            onChange={changeListener('stats.'+value)}
                            onBlur={() => save({}, true)}
                            placeholder=""
                        />
                    </div>
                    <div className="control">
                        <input
                            className="input has-text-centered is-small"
                            type="number"
                            value={character.stats[value+'Add']}
                            onKeyDown={listenForKeydown}
                            onChange={changeListener('stats.'+value+'Add')}
                            onBlur={() => save({}, true)}
                            placeholder=""
                        />
                    </div>
                </div>
            </div>
        )
    }

    function InlineInput({ value_1, value_2, text="" }) {
        return <div className={Styles.inlineInput}>
            <input
                className="input"
                type="number"
                onKeyDown={listenForKeydown}
                onChange={changeListener(`${value_1}.${value_2}`)}
                value={character[value_1][value_2]}
                onBlur={() => {
                    save({}, true)
                }}
            />
            <label className="label is-capitalized">{value_2}{text ? <strong> {text}</strong>:<></>}</label>
        </div>
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
                    <div className="field box is-clickable" onClick={() => setShowSkillsModal(true)}>
                        <label className="label box-label is-clickable">Skills</label>
                    </div>
                    <div className="field box is-clickable" onClick={() => setShowSavingThrowsModal(true)}>
                        <label className="label box-label is-clickable">Saving Throws</label>
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
                        <h1 className="title has-text-centered" style={{ opacity:'0.2' }}>More Coming Soon</h1>
                    </div>
                </div>
            </div>

            <div className="block columns">
                <div className="column">
                    <BigStat value="strength" />
                </div>
                <div className="column">
                    <BigStat value="dexterity" />
                </div>
                <div className="column">
                    <BigStat value="constitution" />
                </div>
                <div className="column">
                    <BigStat value="intelligence" />
                </div>
                <div className="column">
                    <BigStat value="wisdom" />
                </div>
                <div className="column">
                    <BigStat value="charisma" />
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
                                <InlineInput value_1="stats" value_2="acrobatics"     text="(Dex)" />
                                <InlineInput value_1="stats" value_2="animalHandling" text="(Wis)" />
                                <InlineInput value_1="stats" value_2="arcana"         text="(Int)" />
                                <InlineInput value_1="stats" value_2="athletics"      text="(Str)" />
                                <InlineInput value_1="stats" value_2="deception"      text="(Cha)" />
                                <InlineInput value_1="stats" value_2="history"        text="(Int)" />
                                <InlineInput value_1="stats" value_2="insight"        text="(Wis)" />
                                <InlineInput value_1="stats" value_2="intimidation"   text="(Cha)" />
                                <InlineInput value_1="stats" value_2="investigation"  text="(Int)" />
                                <InlineInput value_1="stats" value_2="medicine"       text="(Wis)" />
                                <InlineInput value_1="stats" value_2="nature"         text="(Int)" />
                                <InlineInput value_1="stats" value_2="perception"     text="(Wis)" />
                                <InlineInput value_1="stats" value_2="performance"    text="(Cha)" />
                                <InlineInput value_1="stats" value_2="persuasion"     text="(Cha)" />
                                <InlineInput value_1="stats" value_2="religion"       text="(Int)" />
                                <InlineInput value_1="stats" value_2="sleightOfHand"  text="(Dex)" />
                                <InlineInput value_1="stats" value_2="stealth"        text="(Dex)" />
                                <InlineInput value_1="stats" value_2="survival"       text="(Wis)" />
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
                                <InlineInput value_1="savingThrows" value_2="strength" />
                                <InlineInput value_1="savingThrows" value_2="dexterity" />
                                <InlineInput value_1="savingThrows" value_2="constitution" />
                                <InlineInput value_1="savingThrows" value_2="intelligence" />
                                <InlineInput value_1="savingThrows" value_2="wisdom" />
                                <InlineInput value_1="savingThrows" value_2="charisma" />
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