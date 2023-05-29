import { useState, useEffect } from "react";

// Router
import { useParams, Outlet, Navigate, useNavigate } from "react-router-dom";

// Redux
import { dispatch } from "store";
import { setMessages, setNotes, setPlayers, reset } from 'redux/play/reducer'
import { initCampaign } from "redux/play/advancedActions";
import { useAppSelector } from "core/redux";

// Data
import axios from 'axios'
import { initSocket, closeSocket } from "./socket";

// UI
import Loader from "common/Loader";

// Styles
import Styles from './_.module.sass'

export default function GameSync(): any{
    
    const [ ready, setReady ] = useState(false)

    const isAuthorized = useAppSelector(state => state.user.authorized)

    const navigate = useNavigate()
    const { id='' } = useParams()

    useEffect(() => {

        Promise.all([
            axios.post(`play/getNotes`,    { campaign_id: id }),
            axios.post(`play/getPlayers`,  { campaign_id: id }),
            axios.post(`play/getChat`,     { campaign_id: id }),
            initSocket(id)
        ])
        .then((results) => {
            const [ notes, players, chat ] = results;

            const { messages, campaign } = chat.data;

            if(!campaign){
                setReady(true)
                closeSocket()
                return navigate(`/play/${id}/join`)
            }

            dispatch(setNotes(notes.data))
            dispatch(setPlayers(players.data))
            dispatch(setMessages(messages))
            dispatch(initCampaign(campaign))

            setReady(true)
        })

        return () => {
            closeSocket()
            dispatch(reset())
        }

    // eslint-disable-next-line
    }, [ id ])

    if(!isAuthorized){
        return <Navigate to="/login" />
    }

    if(!ready){
        return <Loader key='global-loader' fullpage={true} />
    }

    return <div className={Styles.Game}>
        <Outlet />
    </div>
}
