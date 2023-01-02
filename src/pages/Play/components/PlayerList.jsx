import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import Healthbar from './Healthbar';

import CampaignContext from '../CampaignContext.jsx'

import Styles from '../_.module.sass'

export default function PlayerList() {

    const campaign = useContext(CampaignContext)
    const { players={}, isDungeonMaster=false } = campaign;

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
                        player={player}
                        isDungeonMaster={isDungeonMaster}
                    />
                )
            }
        </div>
    </>)

}

function PlayerItem({ player, isDungeonMaster }){

    const { id } = useParams()

    let {
        uid,
        data:{
            character: {
                name,
                image,
                features: {
                    class:character_class="",
                    race=""
                }={}
            },
            current: {
                hidden=false,
                health,
                maxHealth
            },
            player_name=""
        }
    } = player;

    const isNPC = player_name === 'NPC'

    try{
        player_name = player_name.split(' ')[0]
    } catch(e){}

    if(hidden && !isDungeonMaster){
        return <></>
    }

    let classes = [Styles.Player]
    if(isNPC){ classes.push(Styles.isNPC) }
    if(hidden){ classes.push(Styles.isHiddenDMOnly) }
    
    return <div className={classes.join(' ')}>
        { isNPC
        ? <figure className={"image is1by1 is-clickable " + Styles.image}>
            <img src={image} alt="" draggable={false}/>
        </figure>
        : <Link className={"image is1by1 is-clickable " + Styles.image} to={`/play/${id}/player/${uid}`}>
            <img src={image} alt="" draggable={false}/>
        </Link>
        }
        <div className={Styles.body}>
            <div className={Styles.titles}>
                <p>{name}</p>
                <p>({player_name})</p>
            </div>
            <p className={Styles.subtitle}>
                {
                    character_class || race
                    ? `${character_class} ${race?'|':''} ${race}`
                    : isNPC
                        ? 'Not A Robot'
                        : 'Player'
                }
            </p>
            <Healthbar current={health} max={maxHealth} />
        </div>
    </div>
}