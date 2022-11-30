import { useEffect, useState, useContext } from "react"
import { Link, useParams } from 'react-router-dom'
import moment from "moment"

import UserContext from '../../context/User.jsx'

import { getDatabase, ref, onValue } from "firebase/database"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

import Loader from "../../common/Loader"
import CampaignPlayerListItem from "./CampaignPlayerListItem.jsx"

// import Styles from "./_.module.sass"

export default function ViewOne({ ...props }) {

    const [user] = useContext(UserContext)
    const [state, setState] = useState({
        loading: true,
        campaign: {}
    })
    const { id } = useParams()

    useEffect(() => {
        const reference = ref(getDatabase(), "campaigns/" + user.uid + '/' + id)
        onValue(reference, (snapshot) => {
            setState((s) => {
                return { ...s, loading: false, campaign: snapshot.val() }
            })
        })
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
                        <Link className="button is-primary" to={"/play/"+id}>
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
                        campaign.players.map((player) => (
                            <CampaignPlayerListItem key={player.player_uid} player={player} />
                        ))
                    }
                </div>
                <div className="column is-3">
                    <div className="box">
                        <p>Campaign Created</p>
                        <p>{moment(campaign.created).format("MMMM Do YYYY")}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
