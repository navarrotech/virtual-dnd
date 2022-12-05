import { useEffect, useState, useContext } from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import moment from "moment"

import UserContext from '../../context/User.jsx'

import { getDatabase, remove, ref, onValue, set } from "firebase/database"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faTrashAlt } from "@fortawesome/free-solid-svg-icons"

import Loader from "../../common/Loader"
import CampaignPlayerListItem from "./CampaignPlayerListItem.jsx"

// import Styles from "./_.module.sass"

export default function ViewOne({ ...props }) {

    const [user] = useContext(UserContext)
    const [state, setState] = useState({
        campaign_name: '',
        loading: true,
        campaign: {}
    })
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        const reference = ref(getDatabase(), "campaigns/" + id)
        const unsubscribe = onValue(reference, (snapshot) => {
            const v = snapshot.val()
            if(!v  || !Object.keys(v).length || !v.name){
                console.log("Campaign not found") 
                return navigate('/campaigns', { replace: false })
            }
            setState((s) => {
                return {
                    ...s,
                    loading: false,
                    campaign: { ...v, uid: id },
                    campaign_name: v.name
                }
            })
        })
        return () => { unsubscribe(); }
    }, [id, user, navigate])

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
                            <input
                                className="input is-large"
                                type="text"
                                placeholder="Epic Adventure #1"
                                value={state.campaign_name}
                                onKeyDown={({ key, target }) => { if(key==='Enter'){ target.blur() } }}
                                onChange={({ target:{ value } }) => {
                                    setState({ ...state, campaign_name: value })
                                }}
                                onBlur={() => {
                                    set(ref(getDatabase(), `/campaigns/${id}/name`), state.campaign_name)
                                    set(ref(getDatabase(), `accounts/${user.uid}/campaigns/${campaign.accountLink}/name`), state.campaign_name)
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="block buttons is-right">
                        <Link className="button is-primary" to={`/play/${id}`}>
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
                    <div className="block box">
                        <label className="label box-label">Characters</label>
                        <div className="level">
                            <p>{user.displayName} (You)</p>
                            <p>Dungeon Master</p>
                        </div>
                        { campaign.players
                            ? Object.keys(campaign.players).map((player_key, index) => {
                                let player_uid = player_key,
                                    player_value = campaign.players[player_key]
                                return <CampaignPlayerListItem key={player_uid} player={player_value} campaign_uid={id} index={index} />
                            })
                            : <></>
                        }
                    </div>
                </div>
                <div className="column is-4">
                    <div className="box">
                        <div className="field">
                            <p onClick={() => console.log(state)}>Campaign Created</p>
                            <p>{moment(campaign.created).format("MMMM Do YYYY")}</p>
                        </div>
                        <div className="field">
                            <button className="button is-danger is-fullwidth is-small is-light" type={"button"} onClick={async () => {
                                await remove(ref(getDatabase(), `/campaigns/${id}`))
                                await remove(ref(getDatabase(), `accounts/${user.uid}/campaigns/${campaign.accountLink}`))
                                navigate("/campaigns")
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
        </div>
    )
}
