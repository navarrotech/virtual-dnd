
// Redux
import { useAppSelector } from "core/redux";

import type { Character } from "redux/characters/types";

// Hooks
import { changeListener, onKeyDown } from 'routes/Characters/forms'

type Features = keyof Character['features']

export default function EditorPageOne() {

    const character = useAppSelector(state => state.characters.current)

    if(!character){
        return <></>
    }

    function Textarea({ value, rows = 3, label }: { value: Features, rows?: number, label?: string }) {
        return (<div className="field">
            <label className="label is-capitalized">{label}</label>
            <textarea
                rows={rows}
                className="textarea"
                onChange={changeListener('features.' + value, false)}
                onKeyDown={onKeyDown}
                value={character?.features[value]}
            >
            </textarea>
            </div>
        )
    }

    function Field({ value, autoFocus=false }:{ value: Features, autoFocus?: boolean }) {
        return (
            <div className="field">
                <label className="label input-label is-capitalized">{ value }</label>
                <div className="control">
                    <input
                        autoFocus={autoFocus}
                        type="text"
                        className="input"
                        onChange={changeListener('features.' + value, false)}
                        onKeyDown={onKeyDown}
                        value={character?.features[value]}
                    />
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="block columns">
                
                <div className="column">
                    <Field value="age" autoFocus />
                    <Field value="height" />
                </div>
                <div className="column">
                    <Field value="weight" />
                    <Field value="eyes" />
                </div>
                <div className="column">
                    <Field value="skin" />
                    <Field value="hair" />
                </div>
                
            </div>
            <div className="block columns">
                <div className="column">
                    <Textarea value="backstory" label="backstory" rows={9} />
                    <Textarea value="additionalFeatures" label="features" />
                </div>
                <div className="column">
                    <Textarea value="ideals" label="ideals" />
                    <Textarea value="bonds" label="bonds" />
                    <Textarea value="flaws" label="flaws" />
                </div>
            </div>
        </>
    )
}
