
import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react';

// Redux
import { useAppSelector } from 'core/redux';
import { setEntity } from 'redux/play/mapbox';

import Styles from '../../_.module.sass'

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN as string + '/'

function EntityMarker({ image, name, color='#6FC961' }: { image: string, name: string, color?: string }){
  const [ isDragging, setIsDragging ] = useState(false)

  useEffect(() => {
    if(!isDragging){
      return;
    }
    const listener = () => {
      document.removeEventListener('mouseup', listener)
      setIsDragging(false)
    }
    document.addEventListener('mouseup', listener)
    return () => {
      document.removeEventListener('mouseup', listener)
    }
  }, [ isDragging ])

  return <div className={`${Styles.Entity} ${(isDragging ? ' ' + Styles.isMoving : '')}`} onMouseDown={() => setIsDragging(true)}>
      <img src={API_DOMAIN + image} alt={name} draggable={false} crossOrigin='anonymous' />
      <label className={Styles.EntityLabel}>{name}</label>
    <div
        style={{ background: color }}
        className={Styles.EntityPop + ' is-clickable'}
    />
  </div>
}

const EntityElements = {} as Record<string, HTMLElement>
function Entity({ id }: { id: string }){
  const entity         = useAppSelector(state => state.play.map.entities[id])
  const characterName  = useAppSelector(state => state.play.characters[id]?.name)
  const characterImage = useAppSelector(state => state.play.characters[id]?.image)

  useEffect(() => {
    if(!entity || !characterName || !characterImage){
      return;
    }

    let HTMLElement = EntityElements[id]
    if(!HTMLElement){
      const element = document.createElement('div')
      const root = createRoot(element)
      root.render(
        <EntityMarker
          image={characterImage}
          name={characterName}
        />
      )
      HTMLElement = element
      EntityElements[id] = HTMLElement
    }

    setEntity(id, entity.x, entity.y, HTMLElement)
  }, [ entity, characterName, characterImage, id ])

  return <></>
}

export default function Entities(): any {
  const entityKeys = useAppSelector(state => Object.keys(state.play.map.entities))

  return entityKeys.map(id => <Entity key={id} id={id} />)
}
