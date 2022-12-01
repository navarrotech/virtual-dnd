import Styles from "../_.module.sass"

function listenForKeydown({ key, target }) {
    if (key === "Enter" || key === 'Esc') {
        target.blur()
    }
}

export default function EditorPageOne({ character, save }) {
    function changeListener(key) {
        return function ({ target: { value } }) {
            let k = {}
            k[key] = value
            save(k, false)
        }
    }

    function Textarea({ value, rows = 3 }) {
        return (
            <textarea
                rows={rows}
                className="textarea"
                onChange={({ target: { v } }) => {
                    let k = {}
                    k["features." + value] = v
                }}
                onBlur={() => save({}, true)}
                onKeyDown={listenForKeydown}
            >
                {character[value]}
            </textarea>
        )
    }

    function Field({ value }) {
        return (
            <div className="field">
                <label className="label is-capitalized">{value}</label>
                <div className="control">
                    <input
                        type="text"
                        className="input"
                        onChange={({ target: { v } }) => {
                            let k = {}
                            k["features." + value] = v
                        }}
                        onBlur={() => save({}, true)}
                        onKeyDown={listenForKeydown}
                    />
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="block columns">
                <div className="column">
                    <Textarea value="backstory" rows={6} />
                    <Textarea value="additionalFeatures" />
                    <Textarea value="ideals" />
                    <Textarea value="bonds" />
                    <Textarea value="flaws" />
                    <Textarea value="features" />
                </div>
                <div className="column">
                    <Field value="age" />
                    <Field value="height" />
                    <Field value="weight" />
                    <Field value="eyes" />
                    <Field value="skin" />
                    <Field value="hair" />
                </div>
            </div>
        </>
    )
}
