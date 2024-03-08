import { useState } from 'react'

import IconList from './Icons.jsx'
import Styles from 'sass/ChooseAvatar.module.sass'

type Props = {
    onChoose: (icon: string | null) => void
    current: string
}

export default function ChooseIcon({ onChoose, current }: Props){
    const [selected, setSelected] = useState(current)

    return (
        <div className={"modal is-active " + Styles.ChooseAvatar}>
            <div className="modal-background" onClick={() => { onChoose(null) }}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Select An Avatar</p>
                    <button className="delete" onClick={() => { onChoose(null) }}></button>
                </header>
                <section className="modal-card-body">
                    <div className={Styles.ChooseAvatarImages}>
                        { Object.keys(IconList).map((filename) =>{
                            const { name, element } = IconList[filename];
                            return (<figure key={filename} onClick={() => { setSelected(filename); }} className={"image " + (filename === selected ? Styles['is-selected'] : '')}>
                                <span className="icon is-large">
                                    <img src={element} alt={name}/>
                                </span>
                                <p className="is-size-7 is-capitalized">{ name }</p>
                            </figure>)
                        })}
                    </div>
                </section>
                <footer className="modal-card-foot buttons is-right">
                    <button className="button" type="button" onClick={() => { onChoose(null) }}>
                        <span>Cancel</span>
                    </button>
                    <button className="button is-primary" type="button" onClick={() => { onChoose(selected) }}>
                        <span>Save</span>
                    </button>
                </footer>
            </div>
        </div>
    )
}
