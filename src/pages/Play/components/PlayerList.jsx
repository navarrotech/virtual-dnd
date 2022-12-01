import Styles from '../_.module.sass'

export default function PlayerList({ players }) {

    return (
        <div className={Styles.Players}>
            {
                Object.values(players).map(player => {
                    return <div>{player.player_name}</div>
                })
            }
            {/* <p>{myCharacter.name}</p> */}
        </div>
    )

}