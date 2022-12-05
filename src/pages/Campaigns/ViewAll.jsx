import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router"

// Context
import UserContext from "../../context/User.jsx"

// Firebase
import { getDatabase, ref, push, onValue, set } from "firebase/database"

// Components & Styles
import Loader from "../../common/Loader"
import CampaignItem from "./CampaignItem.jsx"
import Styles from "./_.module.sass"

export default function ViewAll({ ...props }) {
    const [user] = useContext(UserContext)
    const [state, setState] = useState({ campaigns: [], loading: true })
    const navigate = useNavigate()

    useEffect(() => {
        const reference = ref(getDatabase(), "accounts/" + user.uid + "/campaigns")
        console.log("Gathering data!")
        const unsubscribe = onValue(reference, (snapshot) => {
            console.log("Incoming sync")
            let campaigns = snapshot.val()
            if(!snapshot.exists()){
                campaigns = []
            }
            setState((s) => {
                return { ...s, loading: false, campaigns }
            })
        }, )
        return () => { unsubscribe(); }
    }, [user])

    function create() {
        const reference = ref(getDatabase(), "/campaigns")
        push(reference, {
            name: "New Campaign",
            owner: user.uid,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            chat: [],
            players: {},
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
            <div className={"block " + Styles.CampaignList}>
                {
                    Object.keys(state.campaigns||[]).length
                        ? Object.keys(state.campaigns).map((key) => <CampaignItem key={key} campaign={state.campaigns[key]} />)
                        : <div className=""><p>You don't have any campaigns created yet!</p></div>
                }
            </div>
        </div>
    )
}
