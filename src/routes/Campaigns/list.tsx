import { useState } from "react"

import { useNavigate } from "react-router"
import { Link } from "react-router-dom"

// Redux
import { useAppSelector } from "core/redux.js"
import { shallowEqual } from "react-redux"
import { createCampaign } from "redux/campaigns/reducer"
import { dispatch } from "core/redux.js"

// Components
// import CampaignItem from "./CampaignItem.jsx"

// Utility
import axios from 'axios'
import moment from 'moment'

// Styles
import Styles from "./_.module.sass"

export default function ViewAll() {

    const myCampaignsMap = useAppSelector((state) => state.campaigns.myCampaigns, shallowEqual)
    const playingInMap = useAppSelector((state) => state.campaigns.playingIn, shallowEqual)

    const myCampaigns = Object.entries(myCampaignsMap)
    const playingIn = Object.entries(playingInMap)

    return (
        <div className="container is-fluid">
            <div className="block level">
                <div className="block buttons is-left">
                    <Create />
                </div>
            </div>
            { myCampaigns.length
                ? <>
                    <div className="block">
                        <h2 className="is-size-3">My Campaigns:</h2>
                    </div>
                    <div className={"block " + Styles.CampaignList}>{
                        myCampaigns.map(([ id, campaign ]) => <Link key={campaign.id} className={Styles.CampaignItem} to={`/campaigns/${id}`}>
                            <div className={Styles.cover} style={{ backgroundImage: "url('https://thumbs.dreamstime.com/b/grassy-fields-mountainous-rural-area-grassy-fields-mountainous-rural-area-lovely-rural-landscape-carpathian-mountains-106959660.jpg')" }}></div>
                            <div className={Styles.titles}>
                                <h1 className={Styles.title}>{campaign.name}</h1>
                                <h2 className={Styles.subtitle}>Created {moment(campaign.created).format("MMM Do YYYY")}</h2>
                            </div>
                        </Link>)
                    }</div>
                </>
                : <></>
            }
            { playingIn.length
                ? <>
                    <div className="block">
                        <h2 className="is-size-3">Joined Campaigns:</h2>
                    </div>
                    <div className={"block " + Styles.CampaignList}>{
                        playingIn.map(([ id, campaign ]) => <Link key={campaign.id} className={Styles.CampaignItem} to={`/play/${id}`}>
                            <div className={Styles.cover} style={{ backgroundImage: "url('https://thumbs.dreamstime.com/b/grassy-fields-mountainous-rural-area-grassy-fields-mountainous-rural-area-lovely-rural-landscape-carpathian-mountains-106959660.jpg')" }}></div>
                            <div className={Styles.titles}>
                                <h1 className={Styles.title}>{campaign.name}</h1>
                                <h2 className={Styles.subtitle}>Click to jump back in!</h2>
                            </div>
                        </Link>)
                    }</div>
                </>
                : <></>
            }
            { !myCampaigns.length && !playingIn.length
                ? <div className=""><p>You haven't created or joined any campaigns yet!</p></div>
                : <></>
            }
        </div>
    )
}

function Create(){

    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()

    async function create(){
        setLoading(true)
        const result = await axios.post("/data/dnd_campaigns/create")
        if(result.status === 200 && result.data?.id){
            dispatch(
                createCampaign(result.data)
            )
            navigate(`/campaigns/${result.data.id}`)
        }
    }

    return <button className={"button is-primary is-medium" + (loading ? ' is-loading' : '')} type="button" onClick={create}>
        <span>New Campaign</span>
    </button>
}

