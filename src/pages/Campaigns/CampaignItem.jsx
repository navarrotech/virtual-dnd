import { Link } from 'react-router-dom'
import moment from 'moment'
import Styles from "./_.module.sass"

export default function CampaignItem({ uid, campaign, owner="me" }) {
    return (
        <Link className={Styles.CampaignItem} to={owner==='me'?`/campaigns/${uid}`:`/play/${uid}`}>
            <div className={Styles.cover} style={{ backgroundImage: "url('https://thumbs.dreamstime.com/b/grassy-fields-mountainous-rural-area-grassy-fields-mountainous-rural-area-lovely-rural-landscape-carpathian-mountains-106959660.jpg')" }}></div>
            <div className={Styles.titles}>
                <h1 className={Styles.title}>{campaign.name}</h1>
                { owner === 'me'
                    ? <h2 className={Styles.subtitle}>Created {moment(campaign.created).format("MMM Do YYYY")}</h2>
                    : <h2 className={Styles.subtitle}>Click to jump back in!</h2>
                }
            </div>
        </Link>
    )
}
