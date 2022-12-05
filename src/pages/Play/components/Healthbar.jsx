import Styles from '../_.module.sass'

export default function Healthbar({ current, max, color="is-success", ...props }){
    
    const width = Math.round((current / max) * 100)
    
    return (<div className={Styles.Healthbar + ' ' + color}>
        <p className={Styles.healthText}>{current} / {max}</p>
        <div className={Styles.current} style={{ width: width + '%' }}></div>
    </div>)
}