import { useState, useEffect } from "react"

import Styles from '../_.module.sass'

export default function Map({ map: { entities={} }, players, ...props }){

    const [state, setState] = useState({
        moving: false,
        posX: 0,
        posY: 0,
        scale: 1,
        width: 1000,
        height: 1000
    })

    useEffect(() => {
        const listener = ({ ...event }) => {
            console.log(event)
            // setState(scale + 0.01)
        };
        document.addEventListener('scroll', listener)
        return () => { document.removeEventListener('scroll', listener) }
    })

    function onMouseDown() {
        setState({ ...state, moving:true })
    }
    function onMouseUp() {
        setState({ ...state, moving:true })
    }

    return (
        <div className={Styles.Map}>
            <div
                className={Styles.MapBox + (state.moving?Styles.isDragging:'')}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                style={{
                    width:  (state.width  * state.scale) + 'px',
                    height: (state.height * state.scale) + 'px',
                    left:   (state.posX   * state.scale) + 'px',
                    right:  (state.posY   * state.scale) + 'px'
                }}>
                    {
                        Object.keys(entities).map(entity_key => {
                            let value = entities[entity_key]
                            let classes = [Styles.Entity]
                            if(players[entity_key]){ classes.push(Styles.isPlayer) }
                            return <div className={classes.join(' ')} style={{ top: value.x + 'px', left: value.y + 'px' }}></div>
                        })
                    }
                    <div className={Styles.Entity + ' ' + Styles.isPlayer} style={{ top:'10px', left: '10px' }}></div>
                    <div className={Styles.Entity + ' ' + Styles.isPlayer} style={{ top:'30px', left: '80px' }}></div>
                    <div className={Styles.Entity + ' ' + Styles.isPlayer} style={{ top:'80px', left: '400px' }}></div>
                    <div className={Styles.Entity} style={{ top:'60px', left: '60px' }}></div>
            </div>
        </div>
    )

}