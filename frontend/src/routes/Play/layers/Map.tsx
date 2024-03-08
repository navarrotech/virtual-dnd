
import { useEffect } from 'react';

// Mapbox
import { initMapbox, removeMap, changeMapImage } from 'redux/play/mapbox';

// Map Layers
import Entities from './map/Entities';

// Redux
import { useAppSelector } from 'core/redux';

import 'mapbox-gl/dist/mapbox-gl.css'
import Styles from '../_.module.sass'

export default function Map(){
  return <>
    <BaseImageLayer key='mapbox-base' />
    <Entities key='mapbox-entities' />
    <MapControl key='mapbox' />
  </>
}

function BaseImageLayer(){
  const imageLayer = useAppSelector(state => state.play.map.imageLayer)

  useEffect(() => {
    const { url, sizeX, sizeY } = imageLayer
    changeMapImage(url, sizeX, sizeY)
  }, [ imageLayer ])

  return <></>
}

function MapControl() {
  
  useEffect(() => {
    initMapbox();
    return () => removeMap()
  }, []);

  return (
    <div className={Styles.Map}>
      <div id='mapbox' className={Styles.MapBox} />
    </div>
  );
}
