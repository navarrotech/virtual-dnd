import type { WebsocketRequestHandler } from 'express-ws';
import type { DnDSession } from '../types'

import { v4 as uuid } from 'uuid'

// Saving to database
import addToChat        from './saves/chat'
import updateEntityData from './saves/entity';
import setCharacterData from './saves/character';
import setGameState     from './saves/gamestate'

type Subscriber = { 
  id: string,
  campaign_id: string,
  fn: Function
}

const types = [ 'chat', 'note', 'gamestate', 'player', 'unauthorized', 'init', 'ready', 'update', 'entity', 'character', 'player-joined' ] as const
type Type = typeof types[number]
type IncomingSocketMessage = {
  type: Type,
  campaign_id?: string,
  data?: any
}

type OutgoingSocketMessage = {
  type: Type,
  data?: any
}

type SubcribedFunction = (
  { type, table, data }: {
    type: string,
    table: string,
    data: any,
    meta: any,
  }
) => any | void

class PubSub {

  subscribers: Subscriber[] = []
  constructor(){}

  emit(campaign_id: string, data: any){
    this.subscribers.forEach(sub => {
      if(sub.campaign_id === campaign_id){
        sub.fn(data)
      }
    })
  }

  subscribe(campaign_id: string, fn: SubcribedFunction): string{
    let id: string = uuid()
    this.subscribers.push({ id, campaign_id, fn })
    return id
  }

  unsubscribe(id: string){
    this.subscribers = this.subscribers.filter(sub => sub.id !== id)
  }

}

const SaveHandlers: Record<string, (campaign_id: string, data: any) => void> = {
  'chat': addToChat,
  'entity': updateEntityData,
  'character': setCharacterData,
  'gamestate': setGameState
}

export const PlayEventSystem = new PubSub()

export default <WebsocketRequestHandler>function SocketHandler(socket, req) {

  const subscriptionIds: string[] = [];
  const session = req.session as DnDSession

  const send = (data: OutgoingSocketMessage) => socket.send(JSON.stringify(data))

  if(!session || !session.authorized){
    console.log("Rejecting unauthorized ws for dnd/play")
    send({
      type: 'unauthorized'
    })
    return socket.close();
  }

  let CAMPAIGN_ID: string;
  socket.on('message', function(msg) {
    if(!session.authorized || !session.user?.id){
      return send({
        type: 'unauthorized'
      })
    }
    try {
      let data = JSON.parse(msg.toString()) as IncomingSocketMessage
      if (data.type === 'update'){
        if(!CAMPAIGN_ID){
          return;
        }
        PlayEventSystem.emit(CAMPAIGN_ID, data)
      }
      else if(data.type === 'init'){
        const campaign_id = data.campaign_id
        if(campaign_id){

          CAMPAIGN_ID = campaign_id;

          let subscriberId = PlayEventSystem.subscribe(campaign_id, (data: any) => send(data))
          subscriptionIds.push(subscriberId)

          send({ type: 'ready' })
        }
      } else if (types.includes(data.type)){
        PlayEventSystem.emit(CAMPAIGN_ID, data)
        SaveHandlers[data.type]?.(CAMPAIGN_ID, data.data)
      }
    } catch(e){
      console.error(e)
    }
  });

  socket.on('error', function(err) {
    console.error(err);
  })

  socket.on('close', function() {
    subscriptionIds.forEach(id => {
      PlayEventSystem.unsubscribe(id)
    })
  })

  send({ type: 'init' })

}
