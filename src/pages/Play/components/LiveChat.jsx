import { useState, useEffect, useRef } from 'react'

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import Styles from '../_.module.sass'

import moment from "moment"

export default function LiveChat({ chat:rawChat, me, api }){

    const [ state, setState ] = useState({
        message: '',
        show: false
    })
    const [ time, setTime ] = useState(moment())
    const textarea = useRef()
    const historyPanel = useRef()

    const chat = rawChat
        ? Object.keys(rawChat)
            .map(key => {
                let values = rawChat[key];
                return { ...values, uid:key }
            })
            // Sort: May be unnecessary?
            .sort((a,b) => {
                return a.when - b.when
            })
        : []

    function scrollToBottom(){
        try{ historyPanel.current.scroll(0, 100000)
        } catch(e){  }
    }

    function send(){
        if(state.message === ''){ return }
        api.livechat.SendMessage(state.message, chat.length)
        setState({ ...state, message: '', show: false })
        scrollToBottom()
        if(textarea && textarea.current){ textarea.current.blur() }
    }

    useEffect(() => {
        const listener = function(event){

            let { key='' } = event;
            let { current:element=null } = textarea

            if(key === 'Escape'){
                if(element){ element.blur() }
                return setState({ ...state, show:false, message:'' });
            }
            if(key === 'Enter' && !state.show){
                setState({ ...state, show: true })
                if(element){ element.focus() }
                event.preventDefault()
            }
        }
        document.addEventListener('keydown', listener)
        return () => {
            document.removeEventListener('keydown', listener);
        }
    }, [state])

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(moment())
        }, 1000)
        return () => { clearInterval(interval) }
    }, [])

    useEffect(() => {
        if(state.show){ return }
        scrollToBottom()
    }, [state, rawChat])

    return (
        <div className={Styles.LiveChat + (state.show?' '+Styles.showAll:'')}>
            <div ref={historyPanel} className={Styles.history}>
                <div className={Styles.messages}>
                {
                    chat.map((message) => <Message key={message.uid} message={message} isMe={message.who === me} time={time}/> )
                }
                </div>
            </div>
            <div className={Styles.actions}>
                <div className="field">
                    <div className="control">
                        <textarea
                            ref={textarea}
                            className="textarea"
                            placeholder="Type to chat..."
                            maxLength={256}
                            value={state.message}
                            onKeyDown={(event) => { if(event.key === 'Enter'){ send(); event.preventDefault(); event.stopPropagation(); }}}
                            onChange={({ target:{ value:message } }) => setState({ ...state, message })}
                        />
                        {/* <button className={"button is-primary is-small is-rounded " + Styles.sendButton} type="button" onClick={send}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faPaperPlane}/>
                            </span>
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    )

}

function Message({ message, isMe, time }){
    let { what, when, name } = message
    if(isMe){ name = "You" }

    let timecheck = moment(when).add(8, 'seconds').isBefore(time)

    return (
        <p className={`${Styles.message} ${isMe ? Styles.isMe : ""} ${timecheck ? Styles.isInvisible : ""}`} data-tooltip={moment(when).format("[Sent] h:mma")}>
            <strong>{name}</strong>: {what}
        </p>
    )
}