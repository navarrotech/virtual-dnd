import { useState, useEffect, useRef, useContext, useMemo } from "react"
import { createPortal } from "react-dom"

import { useLongPress } from "use-long-press"

import ModifyPlayerModal from "./menu/ModifyPlayerModal"

import CampaignContext from '../CampaignContext.jsx'

import Styles from '../_.module.sass'

const longpressConfig = {
    threshold: 500,
    cancelOnMovement: true,
    detect: "both",
    filterEvents: (e) => {
        if (e.button === 2) {
            return false
        }
        return true
    },
}

const zoom_sensitivity = 0.001,
    max_zoom = 3,
    min_zoom = 0.35;

export default function Map(){

    const campaign = useContext(CampaignContext)
    const { players, map } = campaign;

    const [ dragging, setDragging ] = useState(false)

    const MapImage = useRef()
    const ParentMap = useRef()
    const [state, setState] = useState({
        alwaysShowLabels: true,
        posX: 0,
        posY: 0,
        scale: 1,
        width: 1000,
        height: 1000
    })
    const Entities = useMemo(() => {
        return Object.keys(map.entities||{}).map(uid => <MapEntity key={uid} entity={map.entities[uid]} player={players[uid]}/>)
    }, [map.entities, players])

    // Drag, hotkey, and zoom listeners
    useEffect(() => {
        const scaleListener = ({ deltaY }) => {
            let { current:image=null } = MapImage
            setState(state => {
                let scale = state.scale + (deltaY * zoom_sensitivity)

                // Maximum and minimum!
                if(scale >= max_zoom){ scale = max_zoom }
                if(scale <= min_zoom){ scale = min_zoom }

                let { posX, posY } = state

                if(posX + ((image.offsetWidth  / 3)*2) <= 0){ posX = 0 - ((image.offsetWidth  / 3)*2) }
                if(posY + ((image.offsetHeight / 3)*2) <= 0){ posY = 0 - ((image.offsetHeight / 3)*2) }

                return { ...state, scale, posX, posY }
            })
        };
        const dragListener = ({ movementX, movementY }) => {
            let { current:image=null } = MapImage
            // console.log({ movementX, movementY })
            setState(state => {
                // Minimum!
                let posX = state.posX + movementX,
                    posY = state.posY + movementY

                if(posX + ((image.offsetWidth  / 3)*2) <= 0){ posX = 0 - ((image.offsetWidth  / 3)*2) }
                if(posY + ((image.offsetHeight / 3)*2) <= 0){ posY = 0 - ((image.offsetHeight / 3)*2) }

                return { ...state, posX, posY }
            })
        };
        const keydownListener = ({ key, target }) => {
            if((key === ' ' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')){
                setState((state) => {
                    return {
                        ...state,
                        alwaysShowLabels: !state.alwaysShowLabels
                    }
                })
            }
        }
        let { current:element } = ParentMap
        if(element){
            element.addEventListener('wheel', scaleListener)
        }
        if(dragging){
            element.addEventListener('mousemove', dragListener)
        }
        document.addEventListener('keydown', keydownListener)
        return () => {
            if(element){
                element.removeEventListener('wheel', scaleListener)
            }
            if(dragging){
                element.removeEventListener('mousemove', dragListener)
            }
            document.removeEventListener('keydown', keydownListener)
        }
    }, [dragging])

    // Add a class to the body that prevents scroll animations on Chrome that interfere with the map!
    useEffect(() => {
        document.querySelector('body').classList.add('is-clipped')
        document.querySelector('html').classList.add('is-clipped')
        return () => {
            document.querySelector('body').classList.remove('is-clipped')
            document.querySelector('html').classList.remove('is-clipped')
        }
    }, [])
    
    if(!map){ return <></>; }

    return <div ref={ParentMap} className={Styles.Map}>
        <div
            className={Styles.MapBox + (dragging?' '+Styles.isDragging:'')}
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            style={{
                width:  `${100 * state.scale}vw`,
                height: 'auto',
                left:   (state.posX) + 'px',
                top:  (state.posY) + 'px',
            }}>
            <figure className={"image " + Styles.MapImage} draggable={false}>
                <img src={map.image} alt="" draggable={false} ref={MapImage}/>
            </figure>
            <div className={Styles.Entities + (state.alwaysShowLabels?' '+Styles.alwaysShowLabel:'')}>
                { Entities }
            </div>
        </div>
    </div>

}

function MapEntity({ entity, player }){
    const [ showModal, setShowModal ] = useState(false)
    const [ isMoving,  setMoving    ] = useState(false)

    let { x, y } = entity

    const bindLongPress = useLongPress(function(){
        console.log("is moving!")
        setMoving(true)
    }, longpressConfig)

    let classes = [Styles.Entity]
    if(isMoving){ classes.push(Styles.isMoving) }
    if(player && player.character_uid){ classes.push(Styles.isPlayer) }
    
    return <>
        <div
            className={classes.join(' ')}
            style={{
                top:  y + '%',
                left: x + '%'
            }}
        >
            { player 
                ? <>
                    <img src={player.character.image} alt={player.character.name} draggable={false}/>
                    <label className={Styles.EntityLabel}>{player.character.name}</label>
                </>
                : <></>
            }
            <div
                className={Styles.EntityPop + ' is-clickable'}
                {...bindLongPress()}
                onMouseUp={() => {
                    // TODO: Test this!
                    if(isMoving){
                        console.log('Not moving!');
                        setMoving(false)
                    } else {
                        setShowModal(true)
                    }
                }}></div>
        </div>
        { showModal 
            ? createPortal(<ModifyPlayerModal player={player} onClose={() => { setShowModal(null) }}/>, document.querySelector('body'))
            : <></>
        }
    </>
}