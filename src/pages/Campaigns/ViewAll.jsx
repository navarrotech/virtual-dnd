import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router"

// Context
import UserContext from "../../context/User.jsx"

// Firebase
import { getDatabase, onValue, ref, push, set } from "firebase/database"

// Components & Styles
import Loader from "../../common/Loader"
import CampaignItem from "./CampaignItem.jsx"
import Styles from "./_.module.sass"

export default function ViewAll({ ...props }) {
    const [user] = useContext(UserContext)
    const [state, setState] = useState({
        campaigns: [],
        joinedCampaigns: [],
        loading: true
    })
    const navigate = useNavigate()

    useEffect(() => {
        const reference = ref(getDatabase(), "accounts/" + user.uid)
        onValue(reference, (snapshot) => {
            let {
                campaigns=[],
                joinedCampaigns=[]
            } = snapshot.val() || {}
            setState((s) => {
                return {...s, loading: false, campaigns, joinedCampaigns }
            })
        })
    }, [user])

    function create() {
        const reference = ref(getDatabase(), "/campaigns")
        push(reference, {
            name: "New Campaign",
            owner: user.uid,
            created: new Date().toISOString(),
            state:{
                turn: 1,
                phase: 'setup'
            }
        }).then((doc) => {
            let { key } = doc
            push(ref(getDatabase(), "accounts/"+user.uid+'/campaigns'), {
                name: "New Campaign",
                owner: user.uid,
                campaign_uid: key
            })
            .then((doc) => {
                let { key:key2 } = doc
                set(ref(getDatabase(), "campaigns/"+key+"/accountLink"), key2)
            })
            navigate("/campaigns/" + key, { replace: false })
        })
    }

    if (state.loading) {
        return <Loader />
    }

    return (
        <div className="container is-fluid">
            <div className="block level">
                <div className="block buttons is-left">
                    <button className="button is-primary is-medium" type="button" onClick={create}>
                        <span>New Campaign</span>
                    </button>
                </div>
            </div>
            {
                Object.keys(state.campaigns||[]).length
                    ? <>
                        <div className="block">
                            <h2 className="is-size-3">Campaigns created:</h2>
                        </div>
                        <div className={"block " + Styles.CampaignList}>
                            {
                                Object.keys(state.campaigns).map((key) => {
                                    let value = state.campaigns[key]
                                    return <CampaignItem key={key} uid={value.campaign_uid} campaign={value} owner="me"/>
                                })
                            }
                        </div>
                    </>
                    : <></>
            }
            {
                Object.keys(state.joinedCampaigns||[]).length
                    ? <>
                        <div className="block">
                            <h2 className="is-size-3">Campaigns joined:</h2>
                        </div>
                        <div className={"block " + Styles.CampaignList}>
                            { Object.keys(state.joinedCampaigns).map((key) => <CampaignItem key={key} uid={key} campaign={state.joinedCampaigns[key]} owner="other"/>) }
                        </div>
                    </>
                    : <></>
            }
            {
                Object.keys(state.campaigns||[]).length || Object.keys(state.joinedCampaigns||[]).length
                    ? <></>
                    : <div className=""><p>You haven't created or joined any campaigns yet!</p></div>
            }
        </div>
    )
}
