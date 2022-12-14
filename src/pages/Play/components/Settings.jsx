import { useEffect, useState, useContext } from "react"

import { get, getDatabase, ref } from "firebase/database"

import Loader from "common/Loader"

import UserContext from 'context/User.jsx'

export default function Settings({ onClose, ...props }){

    const [user] = useContext(UserContext)
    const [state, setState] = useState({
        loading: true
    })

    useEffect(() => {
        get(ref(getDatabase(), `accounts/${user.uid}/settings`))
            .then(snapshot => {
                if(!snapshot.exists()){
                    return setState({ ...state, loading:false, settings:{} })
                }
                setState({ ...state, loading:false, settings:snapshot.val() })
            })
    }, [])

    if(state.loading){
        return <Loader />
    }

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={() => { onClose() }}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Title</p>
                    <button className="delete" onClick={() => { onClose() }}></button>
                </header>
                <section className="modal-card-body">
                    {/* Volume */}
                    {/* Logout */}
                    {/* Leave Game */}
                    {/* Report User */}
                </section>
                <footer className="modal-card-foot buttons is-right">
                    <button className="button" type="button" onClick={() => { onClose() }}>
                        <span>Cancel</span>
                    </button>
                    <button className="button is-primary" type="button">
                        <span>Save</span>
                    </button>
                </footer>
            </div>
        </div>
    )

}