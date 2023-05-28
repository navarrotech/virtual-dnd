import { useState, useEffect } from "react"

import axios from 'axios'

type ReturnType = {
  text: string,
  setText: (text: string) => void,
  result: any,
  loading: boolean,
  search: (force?: boolean) => void
}

let timeout: any = null;
let lastTextSearch = '';
export default function useDebouncedAxiosSearch(url: string, debounceTimeMs = 1000): ReturnType{

  const [ loading, setLoading ] = useState(false)
  const [ text, setText ] = useState('')
  const [ result, setResult ] = useState()

  function search(force=false){
    if(text === lastTextSearch && !force){
      return;
    }
    setLoading(true)
    axios
      .post(url, { text })
      .catch(console.log)
      .then((res) => {
        if(res && res.status === 200){
          setResult(res.data)
        } else {
          console.error(res)
        }
        lastTextSearch = text;
        setLoading(false)
      })
  }

  useEffect(() => {
    if(timeout){
      clearTimeout(timeout)
      timeout = null;
    }
    if(!text || text.length < 3){
      setLoading(false)
      setResult(undefined)
      return
    }

    timeout = setTimeout(() => {
      setLoading(true)
      axios
        .post(url, { text })
        .catch(console.log)
        .then((res) => {
          if(res && res.status === 200){
            setResult(res.data)
          } else {
            console.error(res)
          }
          lastTextSearch = text;
          setLoading(false)
      })
    }, debounceTimeMs)

  }, [ text, debounceTimeMs, url ])

  return {
    loading,
    text,
    setText,
    result,
    search
  }
}
