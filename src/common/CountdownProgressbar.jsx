import { useEffect, useState } from 'react'

export default function CountdownProgressbar({ time=7000, size='normal', color='primary', ...props }){

    const [ started, setStarted ] = useState(false)

    useEffect(() => {
        setStarted(true)
    }, [])

    return (
        <div className={`progressbar is-${size} is-${color}`}>
            <div className="bar" style={{
                width: started ? '0%' : '100%',
                transition: `width ${time}ms ease`
            }}></div>
        </div>
    )

}