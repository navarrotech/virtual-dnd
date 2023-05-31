
import { useAppSelector } from 'core/redux';

import Styles from 'sass/Dashboard.module.sass'

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN as string

type Props = {
    size?: number,
    title?: string,
    subtitle?: string,
    onClick?: () => void
}
export default function NameTag({ size=64, title, subtitle, onClick }: Props){

    const user = useAppSelector(state => state.user.user)
    const { photoURL, name } = user;
    
    return <div className={`nametag ${Styles.nametag}`}>
        <figure className={`image is-${size}x${size} is-rounded ${(onClick ? ' is-clickable' : '')}`} onClick={onClick}>
            <img src={API_DOMAIN + '/' + photoURL} alt={name} referrerPolicy="no-referrer" crossOrigin='anonymous' />
        </figure>
        <div className="titles">
            <p className="has-text-black has-text-weight-bold">{title ? title : name}</p>
            <p className="has-text-black">{subtitle ? subtitle : 'Level 1 Apprentice'}</p>
        </div>
    </div>
}
