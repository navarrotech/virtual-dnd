import Healthbar from './Healthbar';

import Styles from '../_.module.sass'

export default function PlayerList({ players }) {

    if(!players){
        players = {}
    }

    return (
        <div className={Styles.Players}>
            {
                Object.keys(players).map(player_uid => <PlayerItem key={player_uid} player={players[player_uid]}/>)
            }
        </div>
    )

}

function PlayerItem({ player }){
    const { character:{ name }, player_name="" } = player;

    let player_first_name = player_name.split(' ')[0]

    return <div className={Styles.Player}>
        <figure className={"image " + Styles.image}>
            <div style={{ backgroundImage:`url('https://www.outdoorlife.com/uploads/2019/01/23/LRKQTDWTBHYTDVD37SOTHNSCQI.jpg?auto=webp')` }}/>
        </figure>
        <div className={Styles.body}>
            <div className={Styles.titles}>
                <p>{name}</p>
                <p>({player_first_name})</p>
            </div>
            <p className={Styles.subtitle}>Human | Ex-Jedi</p>
            <Healthbar current={15} max={30}/>
        </div>
    </div>
}