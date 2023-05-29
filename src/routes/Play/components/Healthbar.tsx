import Styles from '../_.module.sass'

type Props = {
    current: number,
    max: number,
    color?: string
}
export default function Healthbar({ current, max, color="is-success" }: Props){
    const width = Math.round((current / max) * 100)
    
    return (<div className={Styles.Healthbar + ' ' + color}>
        <p className={Styles.healthText}>{current} / {max}</p>
        <div className={Styles.current} style={{ width: width + '%' }}></div>
    </div>)
}
