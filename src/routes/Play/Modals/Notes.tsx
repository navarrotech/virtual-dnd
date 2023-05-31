import { useCallback } from 'react'

import { useAppSelector } from 'core/redux'
import { dispatch } from 'core/redux'
import { setNotes, setReducerState } from 'redux/play/reducer'

import type { ModalProps } from '.'

import axios from 'axios'

// import Styles from '../_.module.sass'

export default function Notes({ close }: ModalProps){
    // Styles.NoteModal
    return <div className={"modal-card"}>
        <header className="modal-card-head">
            <p className="modal-card-title">My Notes</p>
        </header>
        <section className="modal-card-body">
            {/* <div className={Styles.Notes + ' field'}> */}
            <div className="field is-fullwidth">
                <div className="control is-expanded">
                    <NoteEditor />
                </div>
            </div>
        </section>
        <footer className="modal-card-foot buttons is-right">
            <button className="button" type="button" onClick={close}>
                <span>Close</span>
            </button>
        </footer>
    </div>
}

let timeout: any = null
function useDebouncedInput(){
    const id = useAppSelector(state => state.play.id)
    const userId = useAppSelector(state => state.user?.user?.id)

    const debounceInput = useCallback((text: string) => {
        // Set reducer immediately
        dispatch(
            setReducerState({
                path: 'notes.' + userId,
                value: text
            })
        )
        // Debounce the server saves
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            // Update the server
            axios.post(
                '/play/setNotes',
                {
                    campaign_id: id,
                    content: text
                }
            )
        }, 1000)
    }, [ id, userId ])

    return debounceInput;
}

function NoteEditor(){
    const userId = useAppSelector(state => state.user?.user?.id)
    const note = useAppSelector(state => state.play.notes[userId])
    const debounceInput = useDebouncedInput()

    return <textarea
        autoFocus
        className="textarea is-fullwidth"
        placeholder=""
        value={note}
        rows={15}
        onChange={(event) => debounceInput(event.target.value)}
        onKeyDown={({ key=null, target }: any) => {
            if(['Enter', 'Escape', 'Esc'].includes(key)){
                target.blur()
            }
        }}
    />
}
