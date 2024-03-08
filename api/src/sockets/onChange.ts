import type { WebsocketRequestHandler } from 'express-ws';
import type { DnDSession } from '../types'
import { v4 as uuid } from 'uuid'

type Subscriber = { 
  id: string,
  topic: string,
  fn: Function
}

type Type = 'update' | 'hello' | 'unauthorized' | 'ready' | 'error' | 'subscribe' | string
type IncomingSocketMessage = {
  type: Type,
  id?: string
}

type OutgoingSocketMessage = {
  type: Type,
  update_type?: Type,
  table?: string,
  data?: any,
  meta?: any
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

  emit(topic: string, data: any, type: string, table: string){
    if(table === 'dnd_users'){
      delete data.password
      delete data.last_login
      delete data.reset_key
      delete data.reset_key_created
    }
    this.subscribers.forEach(sub => {
      // If they are the owner of the data
      const canSend = sub.topic === data?.owner
        // If they have subscribed to this specific id
        || data?.id === sub.topic
        // If they are a player or friend of the doc
        || data?.player_ids?.includes(sub.topic)
        || data?.friend_ids?.includes(sub.topic)
        || false
      // console.log({
      //   canSend,
      //   check1: sub.topic === data?.owner,
      //   subid: sub.topic,
      //   owner: data?.owner,
      //   topic,
      //   sub,
      //   data
      // })
      let meta = {
        isOwner: sub.topic === data?.owner,
      }
      if(canSend){
        sub.fn({ type, table, data, meta })
      }
    })
  }

  subscribe(topic: string, fn: SubcribedFunction): string{
    let id: string = uuid()
    this.subscribers.push({ id, topic, fn })
    return id
  }

  unsubscribe(id: string){
    this.subscribers = this.subscribers.filter(sub => sub.id !== id)
  }

}

export const EventSystem = new PubSub()

export default <WebsocketRequestHandler>function SocketHandler(socket, req) {

  const subscriptionIds: string[] = [];
  const session = req.session as DnDSession

  const send = (data: OutgoingSocketMessage) => socket.send(JSON.stringify(data))

  if(!session || !session.authorized){
    console.log("Rejecting unauthorized ws for dnd")
    send({
      type: 'unauthorized'
    })
    return socket.close();
  }

  socket.on('message', function(msg) {
    if(!session.authorized || !session.user?.id){
      return send({
        type: 'unauthorized'
      })
    }
    try {
      let data = JSON.parse(msg.toString()) as IncomingSocketMessage
      if(data.type === 'hello'){
        send({
          type: 'ready'
        })

        let subscriberId = EventSystem.subscribe(session.user.id, ({ type, data, table, meta }) => {
          send({
            type: 'update',
            update_type: type,
            meta,
            table,
            data
          })
        })
        subscriptionIds.push(subscriberId)
      }
      else if (data.type === 'subscribe' && data.id){
        let subscriberId = EventSystem.subscribe(data.id, ({ type, data, table, meta }) => {
          send({
            type: 'update',
            update_type: type,
            meta,
            table,
            data
          })
        })
        subscriptionIds.push(subscriberId)
      } else if (data.type === 'heartbeat'){
        // Unimplemented
      }
      else {
        send({
          type: 'error',
          data: 'Unknown message type'
        })
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
      EventSystem.unsubscribe(id)
    })
  })

  send({
    type: 'hello'
  })

}
