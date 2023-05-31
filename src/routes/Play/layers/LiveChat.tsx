import { useEffect, useState, useRef } from 'react'

/// Typescript
import type { ChatMessage } from 'redux/play/types'
import type { User } from 'redux/user/types'

// Redux
import { dispatch, useAppSelector } from 'core/redux'
import { setNewMessage, showChat } from 'redux/play/reducer'
import { sendMessage } from 'redux/play/advancedActions'

// Utility
import moment from "moment"

import Styles from '../_.module.sass'
import { getState } from 'store'

export default function LiveChat(){

    const showing = useAppSelector(state => state.play.chat.show)

    return (
        <div className={Styles.LiveChat + (showing ? ' ' + Styles.showAll : '')}>
            <Messages />
            <SendMessageBox />
        </div>
    )

}

function SendMessageBox(){
    const newMessage = useAppSelector(state => state.play.chat.newMessage)
    const textarea:any = useRef()
    const showing = useAppSelector(state => state.play.chat.show)

    function send(){
        if(newMessage === ''){ 
            return
        }

        if(textarea && textarea.current){
            textarea.current.blur()
        }

        dispatch(sendMessage());
    }

    // Listen to "Enter" and "Escape" key globally to trigger input text
    useEffect(() => {
        const listener = function(event: any){

            const { key='', target } = event;
            const { current: element=null } = textarea

            if(key === 'Escape'){
                if(element){
                    element.blur()
                }
                dispatch(showChat(false))
                return
            }
            else if(key === 'Enter' && !showing && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA'){
                try {
                    const state = getState()

                    if(state.play.activeModal){
                        return;
                    }

                    dispatch(showChat(true))
                    if(element){
                        element.focus()
                    }
                    event.preventDefault()
                } catch(e){
                    return;
                }
            }
        }
        document.addEventListener('keydown', listener)
        return () => {
            document.removeEventListener('keydown', listener);
        }
    }, [ textarea, showing ])


    return <div className={Styles.actions}>
        <div className="field">
            <div className="control">
                <textarea
                    ref={textarea}
                    className="textarea"
                    placeholder="Type to chat..."
                    maxLength={256}
                    value={newMessage}
                    onKeyDown={(event) => {
                        if(event.key === 'Enter'){
                            send();
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }}
                    onChange={({ target:{ value } }) => dispatch(setNewMessage(value))}
                />
                {/* <button className={"button is-primary is-small is-rounded " + Styles.sendButton} type="button" onClick={send}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faPaperPlane}/>
                    </span>
                </button> */}
            </div>
        </div>
    </div>
}

function Messages(){
    const showing  = useAppSelector(state => state.play.chat.show)
    const messages = useAppSelector(state => state.play.chat.messages)
    const players  = useAppSelector(state => state.play.players)
    const me       = useAppSelector(state => state.user.user)

    const historyPanel:any = useRef()

    // Scroll to the bottom of the messages every time it's necessary
    useEffect(() => {
        if(!showing){
            historyPanel?.current?.scroll(0, 100000)
        }
    // eslint-disable-next-line
    }, [ showing, messages ])

    return <div
        ref={historyPanel}
        className={Styles.history}
    >
        <div className={Styles.messages}>{
            messages.map(message => <Message
                key={message.id}
                message={message}
                player={players[message.who]}
                isMe={message.who === me.id}
            />)
        }</div>
    </div>

}

const expireTimeMs = 8000;
function Message({ message, isMe, player }: { message: ChatMessage, isMe: boolean, player?: User }){
    const { what, when } = message
    const expireTime = moment(when).add(expireTimeMs, 'ms')
    const [ isHidden, setIsHidden ] = useState(expireTime.isBefore(moment()))

    useEffect(() => {
        if(isHidden){
            return;
        }
        const timeout = setTimeout(() => {
            setIsHidden(true)
        }, moment(expireTime).diff(moment()))
        return () => {
            clearTimeout(timeout)
        }
    }, [ isHidden, expireTime ])

    return (
        <p
            className={`${Styles.message} ${isMe ? Styles.isMe : ""} ${isHidden ? Styles.isInvisible : ""}`}
            data-tooltip={moment(when).format("[Sent] h:mma")}
        >
            <strong>{ isMe ? "Me" : player?.name }</strong>: { what }
        </p>
    )
}
