import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router"

// Context
import UserContext from "../../context/User.jsx"

// Firebase
import { getDatabase, ref, push, onValue } from "firebase/database"

// Components & Styles
import Loader from "../../common/Loader"
import CampaignItem from "./CampaignItem.jsx"
import Styles from "./_.module.sass"

export default function ViewAll({ ...props }) {
    const [user] = useContext(UserContext)
    const [state, setState] = useState({ campaigns: [], loading: true })
    const navigate = useNavigate()

    useEffect(() => {
        const reference = ref(getDatabase(), "campaigns/" + user.uid)
        onValue(reference, (snapshot) => {
            setState((s) => {
                return { ...s, loading: false, campaigns: snapshot.val() }
            })
        })
    }, [user])

    function create() {
        const reference = ref(getDatabase(), "campaigns/" + user.uid)
        push(reference, {
            name: "New Campaign",
            owner: user.uid,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            chat: [],
            players: [
                {
                    player_name: user.displayName,
                    player_username: user.username || "",
                    player_uid: user.uid,
                    character: null,
                    current: {
                        health: "",
                        maxHealth: 0,
                        armorClass: 0,
                        initiative: 0,
                        speed: 30,
                        level: 1,
                        experience: 0
                    },
                },
            ],
        }).then((document) => {
            const { key } = document
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
                        ? Object.keys(state.campaigns).map((key) => <CampaignItem key={key} id={key} campaign={state.campaigns[key]} />)
                        : <div className=""><p>You don't have any campaigns created yet!</p></div>
                }
            </div>
        </div>
    )
}
