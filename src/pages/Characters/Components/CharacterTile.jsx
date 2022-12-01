import { Link } from "react-router-dom"
import Styles from '../_.module.sass'

export default function CharacterTile({ character }) {
    return <Link className={Styles.Character} to={`/characters/${character.uid}`} state={character}>
        <div className={Styles.image} style={{ backgroundImage: `url(${character.image})` }} />
        <div className={Styles.titles}>
            <h1 className="title has-text-centered">{character.name}</h1>
        </div>
    </Link>
}
