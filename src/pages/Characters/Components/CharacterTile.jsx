import { Link } from "react-router-dom"
import Styles from '../_.module.sass'

export default function CharacterTile({ character, onClick, selected=false }) {
    const content = (<>
        <div className={Styles.image} style={{ backgroundImage: `url(${character.image})` }} />
        <div className={Styles.titles}>
            <h1 className="title has-text-centered">{character.name}</h1>
        </div>
    </>)

    if(!onClick){
        return <Link className={Styles.Character + ' ' + (selected?Styles.isSelected:'')} to={`/characters/${character.uid}`}>{content}</Link>
    }
    return <div className={Styles.Character + ' ' + (selected?Styles.isSelected:'')} onClick={onClick}>{content}</div>

}
