// import Styles from "../_.module.sass"

function listenForKeydown({ key, target }) {
    if (key === "Enter" || key === 'Esc') {
        target.blur()
    }
}

export default function EditorPageOne({ character, save }) {

    function Textarea({ value, rows = 3, label }) {
        return (<div className="field">
            <label className="label is-capitalized">{label}</label>
            <textarea
                rows={rows}
                className="textarea"
                onChange={({ target: { v } }) => {
                    let k = {}
                    k["features." + value] = v
                }}
                onBlur={() => save({}, true)}
                onKeyDown={listenForKeydown}
                value={character[value]}
            >
            </textarea>
            </div>
        )
    }

    function Field({ value }) {
        return (
            <div className="field">
                <label className="label input-label is-capitalized">{value}</label>
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
                    <Field value="age" />
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
                    <Textarea value="features" label="features" />
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
