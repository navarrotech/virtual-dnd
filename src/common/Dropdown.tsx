import { useState, useRef } from 'react'
import type { ReactNode } from 'react'

type Props = {
    trigger: JSX.Element,
    className?: string,
    children?: ReactNode
}
export default function Dropdown({ trigger, className, children }: Props){

    const [open, setOpen] = useState(false)
    const dropdown: any = useRef()

    // useEffect(() => {
    //     if(!open){ return }
    //     let { current:element=null } = dropdown
    //     if(!element){ return }

    //     function listener({ target }){
    //         console.log("Click triggered!")
    //         // if(!target.contains(element)){
    //         //     document.removeEventListener('click', listener)
    //         //     setOpen(false)
    //         // }
    //     }

    //     document.addEventListener('click', listener)
    //     return () => {
    //         document.removeEventListener('click', listener)
    //     }
    // }, [open])

    return (
        <div className={(className ? className + ' ' : '') + "dropdown" + (open?' is-active':'')} ref={dropdown}>
            <div className="dropdown-trigger is-clickable" onClick={() => { setOpen(!open) }}>
                { trigger }    
            </div>
            <div className="dropdown-menu">
                <div className="dropdown-content">
                    { children }
                </div>
            </div>
        </div>
    )

}
