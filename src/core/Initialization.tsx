// React
import { useState, useEffect } from 'react';

// Typescript
import type { CharacterDoc } from 'redux/characters/types';
import type { CampaignDoc } from 'redux/campaigns/types';
import type { User, RawUserSession } from 'redux/user/types';

// Redux
import { useAppSelector } from './redux';
import { dispatch } from '../store';
import { setUser, setFriends, setFriendRequests } from 'redux/user/reducer'
import { setCampaigns, setPlayingIn } from 'redux/campaigns/reducer';
import { setCharacters } from 'redux/characters/reducer';
import { onChange } from 'redux/app/reducer';

// Utility
import ReconnectingWebSocket from 'reconnecting-websocket';
import axios from 'axios'
import Loader from 'common/Loader';

const socketAddress: string = `${import.meta.env.VITE_API_DOMAIN}/dnd/changes`.replaceAll(/^http/gmi, 'ws')

type AllData = {
  characters: CharacterDoc[],
  campaigns: CampaignDoc[],
  friends: User[],
  friend_requests: User[],
  playing_in: CampaignDoc[]
}

type Props = {
  children: JSX.Element
}

async function initData(): Promise<AllData | null>{
  const result = await axios.post(`/data/all`)
  if(result.status !== 200){
    console.error(result)
    return null;
  }

  return result.data as AllData;
}
async function initAuth(): Promise<RawUserSession | null>{
  const { data: user, status } = await axios.post('/auth/getAuth')
  if(status !== 200 || !user?.authorized){
    return null;
  }
  await startWs()
  return user as RawUserSession;
}

let socket: ReconnectingWebSocket | null = null;
async function startWs(){
  await new Promise(acc => {

    let isResolved = false;
    function resolve(){
      if(!isResolved){
        isResolved = true;
        acc(null)
      }
    }

    if(socket){
      socket.close()
    }

    socket = new ReconnectingWebSocket(socketAddress)

    const send = (data: any) => socket?.send(JSON.stringify(data))

    socket.onmessage = (event: any) => {
      try {
        const data = JSON.parse(event.data);
        if(data.type === 'hello'){
          send({ type: "hello" })
        }
        if(data.type === 'ready'){
          resolve()
        }
        if(data.type === 'update'){
          dispatch(onChange(data))
        }
      } catch (error) {
        console.error(error)
      }
    }

    socket.onclose = () => {
      console.log("Changes socket closed")
      resolve()
    }

    setInterval(() => {
      send({ type: "heartbeat" })
    }, 1000 * 60)
  })
}

export default function Initialization({ children }: Props){

  const [ dataReady, setDataReady ] = useState(false)
  const [ ready, setReady ] = useState(false)
  const isAuthorized = useAppSelector(state => state.user.authorized)

  useEffect(() => {
    initAuth().then((result) => {
      if(result){
        dispatch(setUser(result))
      }
      if(!result?.authorized){
        setDataReady(true)
      }
      setReady(true)
    })
  }, [])

  useEffect(() => {
    if(!isAuthorized){
      // if(socket){
      //   socket.close()
      //   socket = null;
      // }
      return;
    }
    // Fetch all initial date, start event websockets, and then set as ready
    initData().then((result) => {
      if(!result){
        return;
      }
      const { campaigns, characters, friends, friend_requests, playing_in } = result;

      dispatch(setFriends(friends))
      dispatch(setFriendRequests(friend_requests))
      dispatch(setCampaigns(campaigns))
      dispatch(setCharacters(characters))
      dispatch(setPlayingIn(playing_in))

      setDataReady(true)
    })

  }, [ isAuthorized ])

  if(!ready || !dataReady){
    return <Loader fullpage={true} />
  }

  return children
}
