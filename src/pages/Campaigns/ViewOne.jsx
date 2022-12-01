import { useEffect, useState, useContext } from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import moment from "moment"

import UserContext from '../../context/User.jsx'

import { getDatabase, remove, ref, onValue } from "firebase/database"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faTrashAlt } from "@fortawesome/free-solid-svg-icons"

import Loader from "../../common/Loader"
import CampaignPlayerListItem from "./CampaignPlayerListItem.jsx"

// import Styles from "./_.module.sass"

export default function ViewOne({ ...props }) {

    const [user] = useContext(UserContext)
    const [state, setState] = useState({
        loading: true,
        campaign: {}
    })
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        const reference = ref(getDatabase(), "campaigns/" + user.uid + '/' + id)
        const unsubscribe = onValue(reference, (snapshot) => {
            setState((s) => {
                return { ...s, loading: false, campaign: snapshot.val() }
            })
        })
        return () => { unsubscribe(); }
    }, [id, user])

    if (state.loading || !state.campaign || !state.campaign.name) {
        return <Loader />
    }

    const { campaign } = state

    return (
        <div className="container is-max-desktop">
            <div className="block columns">
                <div className="column">
                    <div className="field">
                        <label className="label">Campaign Name:</label>
                        <div className="control">
                            <input className="input is-large" type="text" placeholder="Epic Adventure #1" value={campaign.name} />
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="block buttons is-right">
                        <Link className="button is-primary" to={`/play/${user.uid}/${id}`}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                            <span>Start Session</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="columns">
                <div className="column">
                    {
                        Object.keys(campaign.players).map((player_key, index) => {
                            let player_uid = player_key,
                                player_value = campaign.players[player_key]
                            return <CampaignPlayerListItem key={player_uid} player={player_value} campaign_uid={id} index={index} />
                        })
                    }
                </div>
                <div className="column is-4">
                    <div className="box">
                        <p>Campaign Created</p>
                        <p>{moment(campaign.created).format("MMMM Do YYYY")}</p>
                        <button className="button is-danger is-fullwidth is-small is-light" type={"button"} onClick={async () => {
                            remove(ref(getDatabase(), `/campaigns/${user.uid}/${id}`)).finally(() => { navigate("/campaigns") })
                        }}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faTrashAlt}/>
                            </span>
                            <span>Delete Campaign</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
