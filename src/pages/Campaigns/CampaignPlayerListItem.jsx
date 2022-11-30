// import Styles from './_.module.sass'

export default function CampaignPlayerListItem({ player }) {
    return (
        <div className="box">
            <p>{player.player_name}</p>
        </div>
    )
}