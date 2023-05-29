
import Healthbar from '../components/Healthbar';

import Styles from '../_.module.sass'
import { useAppSelector } from 'core/redux';

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN as string

export default function PlayerList() {

    const characterIds = useAppSelector(state => state.play.characterIds)
    // const NPCs = useAppSelector(state => state.play.NPCs)

    return (<>
        <div className={Styles.Players}>
            {/* DM at the top */}
            <DungeonMasterTile />
            {/* Human players first */}
            {
                characterIds.map(id => <Character id={id} key={id} />)
            }
            {/* NPCs last */}
            {/* TODO: add NPC players */}
        </div>
    </>)

}

function DungeonMasterTile(){
    const owner = useAppSelector(state => state.play.owner)
    const dungeonMaster = useAppSelector(state => state.play.players[owner])

    if(!dungeonMaster){
        return <></>
    }

    return <div className={Styles.Player}>
        {/* <Link className={"image is1by1 is-clickable " + Styles.image} to={`/play/${campaign_id}/player/${id}`}> */}
        <div className={"image is1by1 is-clickable " + Styles.image}>
            <img src={API_DOMAIN + '/' + dungeonMaster.photoURL} alt="" draggable={false} crossOrigin="anonymous" />
        </div>
        <div className={Styles.body}>
            <div className={Styles.titles}>
                <p>{ dungeonMaster.first_name } { dungeonMaster.last_name }</p>
            </div>
            <p className={Styles.subtitle}>
                Dungeon Master
            </p>
            {/* <Healthbar current={health} max={maxHealth} /> */}
        </div>
    </div>
}

function Character({ id }: { id: string }){

    const character = useAppSelector(state => state.play.characters[id])
    const { health, maxHealth } = character.current
    const { class: character_class, race } = character.features
    const player_name = character.player?.first_name

    return <div className={Styles.Player}>
        {/* <Link className={"image is1by1 is-clickable " + Styles.image} to={`/play/${campaign_id}/player/${id}`}> */}
        <div className={"image is1by1 is-clickable " + Styles.image}>
            <img src={API_DOMAIN + '/' + character.image} alt="" draggable={false} crossOrigin="anonymous" />
        </div>
        <div className={Styles.body}>
            <div className={Styles.titles}>
                <p>{character.name}</p>
                <p>({player_name})</p>
            </div>
            <p className={Styles.subtitle}>
                {
                    character_class || race
                    ? `${character_class} ${race?'|':''} ${race}`
                    : 'Player'
                }
            </p>
            <Healthbar current={health} max={maxHealth} />
        </div>
    </div>
}
