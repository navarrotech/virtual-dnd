import { useContext } from 'react'
import UserContext from 'context/User.jsx'

import Styles from 'widget/Dashboard.module.sass'

export default function NameTag({ size=64, ...props }){
    const [ user ] = useContext(UserContext)
    const { photoURL, displayName } = user;
    
    return <div className={"nametag " + Styles.nametag}>
        <figure className={`image is-${size}x${size} is-rounded`}>
            <img src={photoURL} alt={displayName} referrerPolicy="no-referrer" />
        </figure>
        <div className="titles">
            <p className="has-text-black has-text-weight-bold">{displayName}</p>
            <p className="has-text-black">Level 1 Apprentice</p>
        </div>
    </div>
}