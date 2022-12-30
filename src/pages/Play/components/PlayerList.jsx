import { useState, useContext } from 'react';

import ModifyPlayerModal from './menu/ModifyPlayerModal';
import Healthbar from './Healthbar';

import CampaignContext from '../CampaignContext.jsx'

import Styles from '../_.module.sass'

export default function PlayerList() {

    const campaign = useContext(CampaignContext)
    const { players={}, isDungeonMaster=false } = campaign;
    const [ showUserModal, setShowUserModal ] = useState(null)

    return (<>
        <div className={Styles.Players}>
            {
                Object
                    .keys(players)
                    .map(uid => {
                        let data = players[uid]
                        return { uid, data, isHuman: (data && data.player_name === 'NPC'?0:1) }
                    })
                    .sort((a,b) => {
                        return b.isHuman - a.isHuman
                    })
                    .map(player => <PlayerItem
                        key={player.uid}
                        player={player.data}
                        onClick={() => { setShowUserModal({ uid: player.uid, ...player.data }) }}
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