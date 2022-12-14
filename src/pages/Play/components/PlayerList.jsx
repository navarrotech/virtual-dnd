import { useState } from 'react';

import ModifyPlayerModal from './menu/ModifyPlayerModal';
import Healthbar from './Healthbar';

import Styles from '../_.module.sass'

export default function PlayerList({ isDungeonMaster=false, players={} }) {

    const [ showUserModal, setShowUserModal ] = useState(null)

    return (<>
        <div className={Styles.Players}>
            {
                Object.keys(players).map(player_uid => <PlayerItem
                    key={player_uid}
                    player={players[player_uid]}
                    onClick={() => { setShowUserModal({ uid: player_uid, ...players[player_uid] }) }}
                />
                )
            }
        </div>
        { showUserModal
            ? <ModifyPlayerModal isDungeonMaster={isDungeonMaster} player={showUserModal} onClose={() => { setShowUserModal(null) }}/>
            : <></>
        }
    </>)

}

function PlayerItem({ player, onClick }){
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
        <figure className={"image is1by1 is-clickable " + Styles.image} onClick={onClick}>
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