
const response = {
  "version": 8,
  "name": "Blank",
  "metadata": {
    "mapbox:autocomposite": false,
    "mapbox:type": "template",
    "mapbox:sdk-support": {
      "android": "11.0.0",
      "ios": "11.0.0",
      "js": "3.0.0"
    },
    "mapbox:trackposition": true,
    "mapbox:groups": {}
  },
  "center": [
    -30.91893123176422,
    -5.012147778909508
  ],
  "zoom": 1.3014961745245577,
  "bearing": 0,
  "pitch": 0,
  "sources": {},
  "sprite": "mapbox://sprites/anavarrocity/cli95c05i00xj01r5f4u2e0ze/ck2u8j60r58fu0sgyxrigm3cu",
  "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  "projection": {
    "name": "globe"
  },
  "layers": [],
  "created": "2023-05-29T17:51:21.798Z",
  "modified": "2023-05-29T18:08:30.464Z",
  "id": "cli95c05i00xj01r5f4u2e0ze",
  "owner": "anavarrocity",
  "visibility": "private",
  "protected": false,
  "draft": false
}

import type { Response } from 'express'
import type { DndRequest } from '../types'

export default function Route(req: DndRequest, res: Response){
  res.status(200).send(response)
}
