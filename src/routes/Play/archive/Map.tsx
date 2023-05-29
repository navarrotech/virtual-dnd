import { useState, useEffect, useRef, useContext, useMemo } from "react"
import { useParams } from "react-router-dom"
import { createPortal } from "react-dom"

import { getDatabase, ref, update } from "firebase/database"

import { useLongPress } from "use-long-press"

import SelectPlayer from "../components/SelectPlayer.jsx"

import CampaignContext from '../CampaignContext.jsx'

import Styles from '../_.module.sass'

const longpressConfig = {
    threshold: 350,
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

let movable = true;
export default function Map(){

    const campaign = useContext(CampaignContext)
    const { players, map, map:{ entities={} }={} } = campaign;

    const [ dragging, setDragging ] = useState(false)

    const MapImage = useRef()
    const ParentMap = useRef()
    const [state, setState] = useState({
        alwaysShowLabels: true,
        posX: 0,
        posY: 0,
        scale: 1
    })

    const Entities = useMemo(() => Object
        .keys(entities)
        .map(uid => <MapEntity
            key={uid}
            scale={state.scale}
            entity={{ uid, ...entities[uid] }}
            player={players[uid]}
        />)
    , [entities, players, state.scale])

    // Drag, hotkey, and zoom listeners
    useEffect(() => {
        const scaleListener = ({ deltaY }) => {
            if(!movable){ return; }
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
            if(!movable){ return; }
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
            if(!movable){ return; }
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
            id="map"
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

function MapEntity({ entity, player, scale }){
    // console.log('re rendering');
    const { isDungeonMaster=false, myUID=null } = useContext(CampaignContext)
    let { x: initialX = 0, y: initialY = 0 } = entity

    const [ showModal, setShowModal ] = useState(false)
    const [ isMoving,  setMoving    ] = useState(false)

    const { id:campaign_id } = useParams()

    const [ position, setPosition ] = useState({ x: initialX, y: initialY })
    const { x, y } = position

    const isMyToken = (player.uid === myUID || isDungeonMaster)

    const bindLongPress = useLongPress(function(){
        if(!isMyToken){ return }
        setMoving(true)
        movable = false; // This is to disable dragging the global map!
    }, longpressConfig)
    
    useEffect(() => {
        setPosition({ x:initialX, y: initialY })
    }, [initialX, initialY])

    let speed = 30
    if(player && player.character && player.character.current){
        speed = player.character.current.speed || 30
    }
    const ringSize = scale * (speed * 5);
    
    useEffect(() => {

        let newX=0, newY=0;
        const dragListener = (event) => {
            let { offsetX, offsetY, srcElement, srcElement:{ offsetHeight, offsetWidth } } = event;

            if(srcElement.id !== 'map'){ return; }

            let posX = (offsetX / offsetWidth ) * 100,
                posY = (offsetY / offsetHeight) * 100

            // Player is confined to a circular movement!
            if(!isDungeonMaster){
                let radius = 3.4;

                let dist = Math.sqrt(Math.pow(posX - initialX, 2) + Math.pow(posY - initialY, 2));
                if(dist > radius){
                    let radians = Math.atan2((posY - initialY), (posX - initialX))
                    posX = Math.cos(radians) * radius + initialX;
                    posY = Math.sin(radians) * radius + initialY;
                }
            }
            // The dungeon master can move them anywhere they want
            else {
                if(posX < 0){ posX = 0 }
                if(posY < 0){ posY = 0 }
                if(posX > 100){ posX = 100 }
                if(posY > 100){ posY = 100 }
            }

            newX = posX; newY = posY;
            setPosition({ x:posX, y:posY })
        };

        function onMouseUp(event){
            movable = true;
            if(isMoving){
                setMoving(false)
                if(newX || newY){
                    update( ref(getDatabase(), `/campaigns/${campaign_id}/map/entities/${entity.uid}`), { x: newX, y: newY } )
                }
            }
            else if(isMyToken && event.target.id === entity.uid){
                setShowModal(true)
            }
        }

        // Don't allow user to move anything that isn't theirs
        document.addEventListener('mouseup', onMouseUp)
        if(isMoving && (isDungeonMaster || isMyToken)){
            document.addEventListener('mousemove', dragListener)
        }
        return () => {
            document.removeEventListener('mouseup', onMouseUp)
            if(isMoving && (isDungeonMaster || isMyToken)){
                document.removeEventListener('mousemove', dragListener)
            }
        }
    }, [isMoving, isDungeonMaster, isMyToken, campaign_id, entity.uid, initialX, initialY])

    let classes = [Styles.Entity]
    if(isMoving){ classes.push(Styles.isMoving) }
    if(player && player.character_uid){ classes.push(Styles.isPlayer) }
    if(isDungeonMaster){ classes.push(Styles.isDungeonMaster) }
    if(player && player.current && player.current.hidden){ classes.push(Styles.isHiddenToOthers) }

    return <>
        { isMoving && !isDungeonMaster
            ? <div className={Styles.entityMovementLimitCircle} style={{
                top:   initialY + '%',
                left:  initialX + '%',
                width: ringSize + 'px',
                height:ringSize + 'px'
            }}>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="48" strokeWidth="2"/>
                </svg>
            </div>
            : <></>
        }
        <div
            className={classes.join(' ')}
            style={{ top:  y + '%', left: x + '%' }}
        >
            { player 
                ? <>
                    <img src={player.character.image} alt={player.character.name} draggable={false}/>
                    <label className={Styles.EntityLabel}>{player.character.name}</label>
                </>
                : <></>
            }
            <div
                id={entity.uid}
                style={{ background:entity.color }}
                className={Styles.EntityPop + ' is-clickable'}
                {...bindLongPress()}></div>
        </div>
        { showModal 
            ? createPortal(<SelectPlayer player={player} onClose={() => { setShowModal(null) }}/>, document.querySelector('body'))
            : <></>
        }
    </>
}
