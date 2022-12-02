import Styles from '../_.module.sass'

export default function PlayerList({ players }) {

    return (
        <div className={Styles.Players}>
            {
                Object.values(players).map(player => {
                    return <div>
                        <figure className="image is-48x48">
                            <img src={""} alt={player.player_name} />
                        </figure>
                        <p>{player.player_name}</p>
                        <div className={Styles.Healthbar}>
                            <div className={Styles.health} style={{ width: '100%' }}>
                                <span>30 / 30</span>
                            </div>
                        </div>
                    </div>
                })
            }
            {/* <p>{myCharacter.name}</p> */}
        </div>
    )

}