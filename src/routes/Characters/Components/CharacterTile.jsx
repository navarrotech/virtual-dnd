import { Link } from "react-router-dom"
import Styles from '../_.module.sass'

export default function CharacterTile({ character, onClick, selected=false }) {
    const content = (<>
        {/* <div className={Styles.image} style={{ backgroundImage: `url(${character.image})` }} /> */}
        <figure className={"image " + Styles.image}>
            <img src={character.image} alt={character.name}/>
        </figure>
        <div className={Styles.titles}>
            <h1 className="title">{character.name}</h1>
            <h2 className="subtitle">{character.features.race} {character.features.class?'|':''} {character.features.class}</h2>
        </div>
    </>)

    if(!onClick){
        return <Link className={Styles.Character + ' ' + (selected?Styles.isSelected:'')} to={`/characters/${character.uid}`}>{content}</Link>
    }
    return <div className={Styles.Character + ' ' + (selected?Styles.isSelected:'')} onClick={onClick}>{content}</div>

}
