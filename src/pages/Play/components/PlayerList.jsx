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
    let {
        character: {
            name,
            image,
            features: {
                class:character_class="",
                race=""
            }={}
        },
        current: {
            health,
            maxHealth
        },
        player_name=""
    } = player;

    try{
        player_name = player_name.split(' ')[0]
    } catch(e){}

    return <div className={Styles.Player + " " + (player_name === 'NPC'?Styles.isNPC:'')}>
        <figure className={"image is1by1 " + Styles.image}>
            <img src={image} alt="" draggable={false}/>
        </figure>
        <div className={Styles.body}>
            <div className={Styles.titles}>
                <p>{name}</p>
                <p>({player_name})</p>
            </div>
            <p className={Styles.subtitle}>
                {
                    character_class || race
                    ? `${character_class} ${race?'|':''} ${race}`
                    : player_name === 'NPC'
                        ? 'Not A Robot'
                        : 'Player'
                }
                
            </p>
            { player_name !== 'NPC'
                ? <Healthbar current={health} max={maxHealth}/>
                : <></>
            }
        </div>
    </div>
}