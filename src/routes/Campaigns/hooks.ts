import { useEffect, useState } from 'react'

import type { User } from 'redux/user/types'

import axios, { AxiosResponse } from 'axios'

export function usePlayers(campaign_id: string){

  const [ players, setPlayers ] = useState<User[]>([])

  useEffect(() => {
    axios
      .post(`/play/getPlayers`, { campaign_id })
      .then((result: AxiosResponse<User[], any>) => {
        if(result.status === 200){
          setPlayers(result.data)
        }
      })
  }, [ campaign_id ])

  return players
}
