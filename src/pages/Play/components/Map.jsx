import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router"

import { getDatabase, ref, onValue } from "firebase/database"

import Styles from '../_.module.sass'

const zoom_sensitivity = 0.001,
    max_zoom = 3,
    min_zoom = 0.35;

export default function Map({ players, isDungeonMaster=false, ...props }){

    const [map, setMap] = useState(null)
    const [ dragging, setDragging ] = useState(false)
    const { id } = useParams()
    const MapImage = useRef()
    const ParentMap = useRef()
    const [state, setState] = useState({
        posX: 0,
        posY: 0,
        scale: 1,
        width: 1000,
        height: 1000
    })

    // Load the map from Firebase
    useEffect(() => {
        console.log("Resubscribing to map!")
        let reference = ref(getDatabase(), "campaigns/" + id + '/map');
        const unsubscribe = onValue(reference, async (snapshot) => {
            console.log("Map data syncing...")
            setMap(snapshot.val())
        })
        return () => { unsubscribe(); }
    }, [id])

    // Drag and zoom listeners
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
        let { current:element } = ParentMap
        if(element){
            element.addEventListener('wheel', scaleListener)
        }
        if(dragging){
            document.addEventListener('mousemove', dragListener)
        }
        return () => {
            if(element){
                element.removeEventListener('wheel', scaleListener)
            }
            if(dragging){
                document.removeEventListener('mousemove', dragListener)
            }
        }
    }, [dragging])

    if(!map){ return <></>; }

    return (
        <div ref={ParentMap} className={Styles.Map}>
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
                    {
                        map.entities
                        ? Object.keys(map.entities).map(entity_uid => {
                            
                            let { x, y } = map.entities[entity_uid],
                                player_link = players[entity_uid]

                            let size =  (25 * state.scale)
                            if(size <= 18){ size = 18 }
                            
                            return <div
                                key={entity_uid}
                                className={Styles.Entity + (player_link && player_link.character_uid?' '+Styles.isPlayer:'')}
                                style={{
                                    top:  y + '%',
                                    left: x + '%'
                                }}
                            >
                                { player_link 
                                    ? <>
                                        <img src={player_link.character.image} alt={player_link.character.name} draggable={false}/>
                                        <label className={Styles.EntityLabel}>{player_link.character.name}</label>
                                    </>
                                    : <></>
                                }
                                <div
                                    className={Styles.EntityPop}
                                    style={{
                                        width:  size + 'px',
                                        height: size + 'px',
                                        minHeight: size + 'px',
                                    }}
                                ></div>
                            </div>
                        })
                        : <></>
                    }
            </div>
        </div>
    )

}