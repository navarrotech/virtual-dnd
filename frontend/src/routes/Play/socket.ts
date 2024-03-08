
// Typescript
import type { IncomingSocketMessage, SocketMessageType } from "redux/play/types";

// Redux
import { dispatch } from "store";
import { onWs } from 'redux/play/reducer'

import ReconnectingWebSocket from "reconnecting-websocket";

const socketAddress: string = `${import.meta.env.VITE_API_DOMAIN}/dnd/play`.replaceAll(/^http/gmi, 'ws')

let socket: ReconnectingWebSocket | null = null;
export async function initSocket(id: string){
  if(socket){
    socket.close()
  }

  socket = new ReconnectingWebSocket(socketAddress)

  const send = (data: object) => socket?.send(JSON.stringify(data))

  socket.onmessage = (event => {
      try {
          const message: IncomingSocketMessage<any> = JSON.parse(event.data)
          if(message.type === 'init'){
            send({ type: 'init', campaign_id: id })
            return;
          }
          dispatch(onWs(message))
      } catch(e){
          console.error('Invalid socket message: ', e, event, event.data)
      }
  })
}

export function closeSocket(){
  if(socket){
      socket.close()
  }
}

export function updateViaSocket(type: SocketMessageType, data: any){
  if(!socket){
      return;
  }
  socket.send(
      JSON.stringify({
          type,
          data
      })
  )
}
