
// Mapbox
import mapboxgl, { Marker } from 'mapbox-gl';

import backgroundTexture from 'images/dots.png?url'

import { throttle } from 'lodash-es';

// Typescript
import type { Map, AnyLayer, AnySourceData } from "mapbox-gl";
import { updateViaSocket } from 'routes/Play/socket';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hdmFycm9jaXR5IiwiYSI6ImNsaTk0bGZhaTFucmQzZG56OTR6bG56ejgifQ.Y5xARmobGzL-dHdkMCHboA';

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN as string + '/';

// Settings
const boundingBox = 0.15;
const boundingBoxTolerance = 0.1;
const locationX = -155.85;
const locationY = 19.9;

// Every 20000px === 1 coordinate point, so a 20000px by 20000px image will be 1x1
const pixelToCoordinateRatio = 5000;

// Ready queue:
type QueueItem = () => void;
const queue: QueueItem[] = [];

// Exports
let map: Map | null = null
let mapReady = false;
export function initMapbox() {
  map = new mapboxgl.Map({
    container: 'mapbox',
    // style: 'mapbox://styles/mapbox/streets-v12',
    style: 'mapbox://styles/anavarrocity/cli95c05i00xj01r5f4u2e0ze',
    center: [locationX, locationY],
    zoom: 8,
    // Set mapbox to 2D mode
    pitch: 0,
    bearing: 0,
    // minZoom: 11,
    maxZoom: 15,
    maxBounds: getBounds()
  });

  map.on('load', () => {
    if(!map){
      return;
    }
    mapReady = true;
    
    map.addLayer({
      id: 'background-texture',
      type: 'raster',
      source: {
        type: 'raster',
        tiles: [ backgroundTexture ],
        tileSize: 256,
      },
      // minzoom: YOUR_MIN_ZOOM_LEVEL, // Set the minimum zoom level
      // maxzoom: YOUR_MAX_ZOOM_LEVEL, // Set the maximum zoom level
    });

    queue.forEach((callback: any) => callback())
    queue.splice(0, queue.length)

    // Dev helper func
    // map.on('move', () => {
    //   const lngLat = map.getCenter();
    //   const zoom = map.getZoom();

    //   const { lng, lat } = lngLat;

    //   console.log({
    //     lng: lng.toFixed(4),
    //     lat: lat.toFixed(4),
    //     zoom: zoom.toFixed(2)
    //   })
    // });
  });
}

const setNewEntityPositionThrottle = throttle((entityId: string, x: number, y: number) => updateViaSocket('entity', { entityId, x, y }), 60);

type Entities = {
  [key: string]: {
    marker: Marker,
    element: HTMLElement
  }
}
const entities: Entities = {}
export function setEntity(name: string, xPos: number, yPos: number, element: HTMLElement){
  if(!map || !mapReady){
    queue.push(() => setEntity(name, xPos, yPos, element));
    return;
  }

  if(xPos === null){
    xPos = locationX;
  }
  if(yPos === null){
    yPos = locationY;
  }

  if(!entities[name]){
    entities[name] = {
      marker: new Marker(element, { draggable: true }),
      element
    }
    entities[name].marker.setLngLat([ xPos, yPos ])
    entities[name].marker.addTo(map)
    entities[name].marker.on('drag', () => {
      const newLngLat = entities[name].marker.getLngLat();
      setNewEntityPositionThrottle(name, newLngLat.lng, newLngLat.lat)
    })
  }

  entities[name].marker.setLngLat([ xPos, yPos ])
}

export function removeEntity(name: string){
  try {
    entities[name]?.marker?.remove()
    entities[name]?.element?.remove()
  } catch(e){
    // Do nothing
  }
  delete entities[name]
}

export function getMap(){
  return map;
}

export function changeMapImage(url: string, sizeX: number, sizeY: number){
  if(!map || !mapReady){
    queue.push(() => changeMapImage(url, sizeX, sizeY));
    return;
  }

  const { layer, source } = imageToLayer(url, sizeX, sizeY);

  const hasLayer = map.getLayer('dungeon')
  if(hasLayer){
    map.removeLayer('dungeon');
    map.removeSource('dungeon');
  }

  map.addSource('dungeon', source);
  map.addLayer(layer);
}

export function removeMap(){
  if(map){
    map.remove()
    map = null;
    mapReady = false;
  }
}

// Helpers
function pixelsToCoords(x: number, y: number){

  const xRatio = (x / pixelToCoordinateRatio);
  const yRatio = (y / pixelToCoordinateRatio);

  const adjustedLocationX = locationX - (xRatio / 2);
  const adjustedLocationY = locationY + (yRatio / 2);

  return [
    // Top left
    [adjustedLocationX, adjustedLocationY],
    // Top right
    [adjustedLocationX + xRatio, adjustedLocationY],
    // Bottom right
    [adjustedLocationX + xRatio, adjustedLocationY - yRatio],
    // Bottom left
    [adjustedLocationX, adjustedLocationY - yRatio],
  ];
}

function imageToLayer(url: string, sizeX: number, sizeY: number){

  const source: AnySourceData = {
    type: 'image',
    url: API_DOMAIN + url,
    coordinates: pixelsToCoords(sizeX, sizeY)
  }

  const layer: AnyLayer = {
    id: 'dungeon',
    type: 'raster',
    source: 'dungeon',
    paint: {
      'raster-opacity': 1
    }
  }

  return { layer, source }
}

function getBounds(): any{
  const halfBoundingBox = boundingBox / 2;
  
  const x = locationX - boundingBoxTolerance - halfBoundingBox;
  const y = locationY - boundingBoxTolerance - halfBoundingBox;

  const x2 = locationX + boundingBoxTolerance + halfBoundingBox;
  const y2 = locationY + boundingBoxTolerance + halfBoundingBox;

  return [
    [ x, y ], // Southwest (Bottom left) coordinates
    [ x2, y2 ] // Northeast (Top right) coordinates
  ]
}
