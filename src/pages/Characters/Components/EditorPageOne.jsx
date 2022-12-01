import Styles from '../_.module.sass'

function listenForKeydown({ key, target }) {
    if (key === "Enter" || key === "Esc") {
        target.blur()
    }
}
export default function EditorPageOne({ character, save }) {

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
                    <div className="columns">
                        <div className="column">
                            <div className="box">
                                <BigStat value="strength" />
                                <BigStat value="dexterity" />
                                <BigStat value="constitution" />
                                <BigStat value="intelligence" />
                                <BigStat value="wisdom" />
                                <BigStat value="charisma" />
                            </div>
                        </div>
                        <div className="column">
                            {/* <!-- Inspiration --> */}
                            <div className="field is-horizontal">
                                <div className="field-body">
                                    <div className="field">
                                        <p className="control is-expanded">
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
                                        </p>
                                    </div>
                                    <div className="field">
                                        <label className="label">Inspiration</label>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Proficiency Bonus --> */}
                            <div className="field is-horizontal">
                                <div className="field-body">
                                    <div className="field">
                                        <p className="control is-expanded">
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
                                        </p>
                                    </div>
                                    <div className="field">
                                        <label className="label">Proficieny Bonus</label>
                                    </div>
                                </div>
                            </div>
                            <div className="block box">
                                <label className="label has-text-centered">Saving Throws</label>
                                <InlineInput value_1="savingThrows" value_2="strength" />
                                <InlineInput value_1="savingThrows" value_2="dexterity" />
                                <InlineInput value_1="savingThrows" value_2="constitution" />
                                <InlineInput value_1="savingThrows" value_2="intelligence" />
                                <InlineInput value_1="savingThrows" value_2="wisdom" />
                                <InlineInput value_1="savingThrows" value_2="charisma" />
                            </div>
                            <div className="block box">
                                <label className="label has-text-centered">Skills</label>
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
                            </div>
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="columns">
                        <div className="column">
                            <div className="field box">
                                <label className="label has-text-centered">Armor Class</label>
                                <div className="control">
                                    <input className="input has-text-centered is-small" type="number" value="--" disabled={true} />
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="field box">
                                <label className="label has-text-centered">Initiative</label>
                                <div className="control">
                                    <input className="input has-text-centered is-small" type="number" value="--" disabled={true} />
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="field box">
                                <label className="label has-text-centered">Speed</label>
                                <div className="control">
                                    <input className="input has-text-centered is-small" type="number" value="--" disabled={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}