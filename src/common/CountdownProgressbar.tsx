import { useEffect, useState } from 'react'

export default function CountdownProgressbar({ time=7000, size='normal', color='primary', ...props }){

    const [ started, setStarted ] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setStarted(true)
        }, 100)
    }, [])

    return (
        <div className={`progressbar is-${size} is-${color}`}>
            <div className="bar" style={{
                width: started ? '0%' : '100%',
                transition: `width ${time-100}ms linear`
            }}></div>
        </div>
    )

}