// React
import { useState, useEffect } from 'react';

// Redux
import { useAppSelector } from './redux';
import { dispatch } from '../store';
import { setUser } from '../redux/user/reducer'

// Utility
import axios from 'axios'
import Loader from 'common/Loader';

type Props = {
  children: JSX.Element
}

async function init(){
  const { data: user, status } = await axios.post('/auth/getAuth')
  if(status !== 200 || !user?.authorized){
    return null;
  }

  const result = await axios.post(`/data/all`)
  if(result.status !== 200){
    console.error(result)
    return null;
  }

  return {
    user,
    data: result.data
  }
}

export default function Initialization({ children }: Props){

  const [ ready, setReady ] = useState(false)
  const isAuthorized = useAppSelector(state => state.user.authorized)

  useEffect(() => {
    if(ready && isAuthorized){
      return;
    }
    // Fetch all initial date, start event websockets, and then set as ready
    init().then((result) => {
      setReady(true)
      if(!result){
        return;
      }
      const { 
        // data: {
        //   campaigns,
        //   characters,
        //   notes
        // },
        user
      } = result;
      if(user){
        dispatch(setUser(user))
      }
    })
  }, [ isAuthorized, ready ])

  if(!ready){
    return <Loader fullpage={true} />
  }

  return children
}
