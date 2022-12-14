import { useState, useEffect, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { getDatabase, set, push, ref, onValue } from "firebase/database"

import UserContext from 'context/User.jsx'

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import Styles from '../_.module.sass'

import moment from "moment"

const chat_limit = 100

export default function LiveChat({ me }){

    const [ state, setState ] = useState({
        message: '',
        show: false
    })
    const { id } = useParams()
    const [ user ] = useContext(UserContext)
    const [ time, setTime ] = useState(moment())
    const [ chat, setChat ] = useState([])
    const textarea = useRef()
    const historyPanel = useRef()

    function scrollToBottom(){
        try{ historyPanel.current.scroll(0, 100000)
        } catch(e){  }
    }

    function send(){
        if(state.message === ''){ return }
        let database = getDatabase()

        let { message } = state

        try{
            // Push the chat!
            push(ref(database, `campaigns/${id}/chat`), {
                who: user.uid,
                name: user.displayName,
                when: new Date().toISOString(),
                what: message
            })

            if(chat.length >= (chat_limit-1)){
                onValue(ref(database, `campaigns/${id}/chat`), (snapshot) => {
                    // Gather the values
                    let value = snapshot.val()
                    let messages = Object
                        .keys(value)
                        .map(a => {
                            return { uid: a, ...value[a] }
                        })
                        .sort((a,b) => {
                            return a.when - b.when
                        })
                        .reverse()
                    // Process the keys "to keep"
                    let keep = messages.splice(0, chat_limit)
                    // Convert it back to a JSON object
                    messages = {}
                    keep.forEach(m => messages[m.uid] = { ...m, uid:null })
                    set(ref(database, `campaigns/${id}/chat`), messages)
                }, { onlyOnce: true })
            }
        } catch(e){ console.log(e) }
        setState({ ...state, message: '', show: false })
        scrollToBottom()
        if(textarea && textarea.current){ textarea.current.blur() }
    }

    // Get and sync chat data from db
    useEffect(() => {
        // let initialized = false;
        // This updates whenever the players update
        const unsubscribe = onValue(ref(getDatabase(), "campaigns/" + id + '/chat'), async (snapshot) => {
            console.log("Chat data syncing...")

            let rawChat = snapshot.val()
            let chat = rawChat
                ? Object.keys(rawChat)
                    .map(key => {
                        let values = rawChat[key];
                        return { ...values, uid:key }
                    })
                    // Sort: May be unnecessary, but we should do it to verify our data is always legit.
                    .sort((a,b) => {
                        return a.when - b.when
                    })
                : []

            setChat(chat)
        })
        return () => { unsubscribe(); }
    }, [id])

    // Listen to "Enter" and "Escape" key globally to trigger input text
    useEffect(() => {
        const listener = function(event){

            let { key='', target } = event;
            let { current:element=null } = textarea

            if(key === 'Escape'){
                if(element){ element.blur() }
                return setState({ ...state, show:false, message:'' });
            }
            if(key === 'Enter' && !state.show && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA'){
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

    // Set interval for every 1 second, that checks when the messages were sent and styles them
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(moment())
        }, 1000)
        return () => { clearInterval(interval) }
    }, [])

    // Scroll to the bottom of the messages every time it's necessary
    useEffect(() => {
        if(state.show){ return }
        scrollToBottom()
    }, [state, chat])

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