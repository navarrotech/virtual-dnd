import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faPlus, faGlobe } from '@fortawesome/free-solid-svg-icons'

import CampaignContext from '../CampaignContext.jsx'

import { getDatabase, onValue, push, ref, update } from 'firebase/database'

import Loader from 'common/Loader.jsx'

import Styles from '../_.module.sass'

const textPreviewLimit = 118

export default function Notes({ onClose }){

    const { id } = useParams()
    const { myUID } = useContext(CampaignContext)
    const [ notes, setNotes ] = useState(null)

    const [ viewNote, setView ] = useState(null)
    const [ showCreate, setCreate ] = useState(false)

    useEffect(() => {
        // Don't subscribe to changes when we're viewing a specific note!
        if(viewNote !== null){ return; }
        // Gather private notes
        const reference = ref(getDatabase(), `/notes/${id}`)
        const unsubscribe = onValue(reference, (snapshot) => { setNotes((snapshot.val()||{})) })
        return () => { unsubscribe() }
    }, [viewNote, myUID, id])

    if(!notes){
        return <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <Loader/>
            </div>
        </div>
    }

    if(viewNote !== null){
        return <EditNote uid={viewNote} note={notes[viewNote]} onClose={() => setView(null)}/>
    }

    function createNote(type="private"){
        return function(){
            let reference = ref(getDatabase(), `/notes/${id}`)
            const new_note = push(reference, {
                type,
                owner: myUID,
                // title: 'New Note',
                text: '',
                updated: new Date().toISOString(),
                created: new Date().toISOString()
            })
            console.log({ new_note })
            setCreate(false)
            setView(new_note.key)
        }
    }

    // First time viewing notes, two columns with big box choices!
    if(showCreate || !Object.keys(notes).length){
        return <div className="modal is-active">
            <div className="modal-background" onClick={() => {
                if(showCreate){ setCreate(false) }
                else{ onClose() }
            }}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">My Notes</p>
                    <button className="delete is-medium" onClick={() => {
                        if(showCreate){ setCreate(false) }
                        else{ onClose() }
                    }}></button>
                </header>
                <section className="modal-card-body">
                    <h1 className="title is-size-4 has-text-centered">What kind of note do you want to create?</h1>
                    <div className="block columns">
                        
                        <div className="column">
                            <div className={Styles.NewNote} onClick={createNote('public')}>
                                <span className="icon is-large">
                                    <FontAwesomeIcon icon={faGlobe} size="5x"/>
                                </span>
                                <h1 className="title">Public Note</h1>
                                <h2 className="subtitle is-size-6">(For everyone in the campaign)</h2>
                            </div>
                        </div>
                        <div className="column">
                            <div className={Styles.NewNote} onClick={createNote('private')}>
                                <span className="icon is-large">
                                    <FontAwesomeIcon icon={faLock} size="5x"/>
                                </span>
                                <h1 className="title">Private Note</h1>
                                <h2 className="subtitle is-size-6">(Can only be viewed by you)</h2>
                            </div>
                        </div>
                        
                    </div>
                </section>
                <footer className="modal-card-foot buttons is-right">
                    <button className="button" type="button" onClick={() => {
                        if(showCreate){ setCreate(false) }
                        else{ onClose() }
                    }}>
                        <span>Cancel</span>
                    </button>
                    <button className="button is-primary" type="button">
                        <span>Save</span>
                    </button>
                </footer>
            </div>
        </div>
    }

    return (<div className="modal is-active">
        <div className="modal-background" onClick={onClose}></div>
        <div className={"modal-card " + Styles.NoteModal}>
            <header className="modal-card-head">
                <p className="modal-card-title">My Notes</p>
                {/* <button className="delete is-medium" onClick={onClose}></button> */}
                <button className="button is-primary is-rounded" type="button"  onClick={() => setCreate(true)}>
                    <span>New Note</span>
                    <span className="icon">
                        <FontAwesomeIcon icon={faPlus}/>
                    </span>
                </button>
            </header>
            <section className="modal-card-body">
                <div className={Styles.Notes + ' field'}>
                    {
                        Object
                        .keys(notes)
                        .map(uid => { return { uid, ...notes[uid] }})
                        // Sort by updated timestamp
                        .sort((a,b) => new Date(b.updated) - new Date(a.updated))
                        // Sort public first, private second
                        .sort((a,b) => (b.type === 'public'?1:0) - (a.type === 'public'?1:0))
                        .map(value => <NoteItem key={value.uid} value={value} onClick={() => setView(value.uid)}/>)
                    }
                </div>
            </section>
            <footer className="modal-card-foot buttons is-right">
                <button className="button" type="button" onClick={onClose}>
                    <span>Close</span>
                </button>
            </footer>
        </div>
    </div>)

}

function NoteItem({ value, onClick }){

    let { text='', type='private' } = value

    if(text.length >= textPreviewLimit)
        text = text.substring(0, (textPreviewLimit-3)) + '...'

    return <div className={Styles.NotePreview} onClick={onClick}>
        <span className="tags">
            <span className={`tag is-capitalized is-${type==='public'?'success':'primary'}`}>{type}</span>
        </span>
        {/* <h1 className="has-text-weight-bold is-size-6">{title}</h1> */}
        <p className="">{text }</p>
    </div>

}

function EditNote({ uid, note:{ text:initialText='', owner='', type:initialType='private' }={}, onClose: close }){

    const { id } = useParams()
    const [ text, setText ] = useState(initialText)
    const [ type, setType ] = useState(initialType)

    // Close middlware
    function onClose(){
        console.log("Saving!")
        update(ref(getDatabase(), `/notes/${id}/${uid}`), { text, updated: new Date().toISOString() })
        close();
    }

    // Updates when the value changes
    useEffect(() => {
        const unsubscribe = onValue(
            ref(getDatabase(), `/notes/${id}/${uid}/text`), 
            (snapshot) => { setText(snapshot.val()||'') },
            type === 'private' ? { onlyOnce: true } : {  }
        )
        return () => { unsubscribe() }
    }, [type, id, uid])

    // Interval for saving
    // Uses an timeout instead of an interval because of the useeffect dependancies
    // We don't save private notes on an interval to help avoid overusing our serverless limits
    useEffect(() => {
        // No interval saving for private notes
        if(type === 'private'){ return; }
        let timeout = setTimeout(() => {
            console.log("Saving!")
            update(ref(getDatabase(), `/notes/${id}/${uid}`), { text, updated: new Date().toISOString() })
        }, 500)
        return () => { clearTimeout(timeout) }
    }, [type, id, uid, text])

    const oppositeType = type === 'public' ? 'private' : 'public'

    return <div className="modal is-active">
        <div className="modal-background" onClick={onClose}></div>
        <div className={"modal-card " + Styles.NoteModal}>
            <header className="modal-card-head">
                <div className="modal-card-title"><span className="tags are-large">
                    <span className={`tag is-capitalized mb-0 is-${type==='public'?'success':'danger'}`}>{type}</span>&nbsp;Note</span>
                </div>
                <button className="delete" onClick={onClose}></button>
            </header>
            <section className={"modal-card-body " + Styles.ForTextArea}>
                <div className="field">
                    <div className="control">
                        <textarea
                            className="textarea"
                            placeholder="Write your note here..."
                            rows={12}
                            onChange={({ target:{ value } }) => { setText(value) }}
                            value={ text }
                        >
                        </textarea>
                    </div>
                </div>
            </section>
            <footer className="modal-card-foot buttons is-right">
                <button className={"button"} type="button" onClick={() => {
                    setType(oppositeType);
                    console.log("Changing Type!")
                    update(ref(getDatabase(), `/notes/${id}/${uid}`), { type: oppositeType, updated: new Date().toISOString() })
                }}>
                    <span>Change to { oppositeType }</span>
                </button>
                <button className="button is-primary" type="button" onClick={onClose}>
                    <span>Save</span>
                </button>
            </footer>
        </div>
    </div>
}