
import { Link, useParams } from "react-router-dom"

// Typescript
import type { ModalProps } from "."
import type { Character } from "redux/characters/types"
import type { User } from "redux/user/types"

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown, faArrowRight, faBan, faDownload, faExternalLinkAlt, faPlus, faTimes, faTriangleExclamation, faUsersSlash } from "@fortawesome/free-solid-svg-icons"
import { ReactComponent as TreasureChest } from 'images/icons/treasure-chest.svg'

// Redux
import { dispatch, useAppSelector } from "core/redux"
import { setReducerState } from "redux/play/reducer"

// UI
import Dropdown from "common/Dropdown"
import { BigStats } from "../layers/CharacterPanel"

// Utility
import { downloadPDF } from "routes/Characters/DownloadCharacterSheet"
import axios from "axios"

import Styles from '../_.module.sass'

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN as string + '/';

export default function ViewPlayer({ close, meta }: ModalProps) {
    const character = useAppSelector(state => state.play.characters[meta?.playerId || ''])
    const player = useAppSelector(state => state.play.players[character?.player_id || ''])

    if(!character || !player){
        setTimeout(() => close(), 1)
        return <></>
    }

    return <div className={"modal-content " + Styles.ViewPlayer}>
        <div className="block box">
            <div className="block level">
                <div className="level-left">
                    <figure className="image is-96x96 mr-4 is-rounded">
                        <img src={API_DOMAIN + character.image} alt={character.name} crossOrigin="anonymous"/>
                    </figure>
                    <div>
                        <h1 className="title">{ character.name }</h1>
                        <h2 className="subtitle">Played by { player.first_name } { player.last_name }</h2>
                    </div>
                </div>
                <div className="block buttons is-right">
                    {/* TODO: Re-enable friend status: (websocket event/update data issues) */}
                    {/* <FriendStatus player={player} /> */}
                    <EditCharacterButton playerId={player.id} characterId={character.id} />
                    <Actions character={character} player={player} close={close} />
                    {/* <button className="button is-primary" onClick={close}>
                        <span>Back To Game</span>
                        <span className="icon">
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </span>
                    </button> */}
                </div>
            </div>
            <BigStats character={character} className={Styles.isViewCharacter} />
        </div>
    </div>
}

function EditCharacterButton({ playerId, characterId }: { playerId: string, characterId: string }){
    const myId = useAppSelector(state => state.user.user.id)
    const { id='' } = useParams()
    
    if(myId !== playerId){
        return <></>
    }

    return <Link className="button is-primary is-outlined" to={`/characters/${characterId}/stats?rejoin_campaign=${id}`}>
        <span className="icon">
            <FontAwesomeIcon icon={faExternalLinkAlt}/>
        </span>
        <span>Edit Character</span>
    </Link>
}


const TriggerButton = (<button className="button is-primary">
    <span>Actions</span>
    <span className="icon is-small">
        <FontAwesomeIcon icon={faAngleDown} />
    </span>
</button>)

function Actions({ player, character, close }: { player: User, character: Character, close: () => void }){
    const role = useAppSelector(state => state.play.role)
    const isDm = role === 'dm'

    return <Dropdown trigger={TriggerButton} className="is-right">
        { isDm
            ? <>
                <div className="dropdown-item is-clickable icon-text" onClick={() => {
                    dispatch(setReducerState({
                        path: 'previewCharacter',
                        value: character
                    }))
                    close()
                }}>
                    <span className="icon">
                        <TreasureChest />
                    </span>
                    <span>View Inventory</span>
                </div>
                {/* <div className="dropdown-item is-clickable icon-text is-danger" onClick={() => { kick(uid, id); navigate(`/play/${id}`); }}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                    <span>Kick player</span>
                </div>
                <div className="dropdown-item is-clickable icon-text is-danger" onClick={() => { ban(uid, id); navigate(`/play/${id}`); }}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faBan} />
                    </span>
                    <span>Ban player</span>
                </div> */}
            </>
            : <>
                <div className="dropdown-item is-clickable icon-text is-danger" onClick={() => { 
                    // TODO
                }}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faTriangleExclamation}/>
                    </span>
                    <span>Report Player</span>
                </div> 
            </>
        }
        <div className="dropdown-item is-clickable icon-text" onClick={() => downloadPDF(player.name, character)}>
            <span className="icon">
                <FontAwesomeIcon icon={faDownload}/>
            </span>
            <span>Character Sheet</span>
        </div>
    </Dropdown>
}

function FriendStatus({ player }: { player: User }){
    const myUserId = useAppSelector(state => state.user.user.id)
    const myFriendRequests = useAppSelector(state => state.user.user.friend_req_ids)
    const friends = useAppSelector(state => state.user.friendsMap)
    const theirFriendRequests: string[] = player?.friend_req_ids || []

    console.log({
        theirFriendRequests,
        myFriendRequests,
        friends,
        myUserId
    })

    const isMyFriend = !!friends[player.id || ''] || false
    const isRequestedForFriends = theirFriendRequests.includes(myUserId|| '')
    const theyRequestedForFriends = myFriendRequests.includes(player.id || '')

    if(isMyFriend){
        return <div className="button" onClick={() => {
            axios.post(`/friends/remove`, { friend_id: player.id })
        }}>
            <span className="icon">
                <FontAwesomeIcon icon={faUsersSlash}/>
            </span>
            <span>Unfriend</span>
        </div>
    }
    else if(isRequestedForFriends){
        return <div className="button has-tooltip-bottom" data-tooltip="Click to cancel" onClick={() => {
            axios.post(`/friends/add`, { friend_id: player.id, approve: false })
        }}>
            <span className="icon">
                <FontAwesomeIcon icon={faTimes}/>
            </span>
            <span>Pending Friends</span>
        </div>
    } else if (theyRequestedForFriends){
        return <div className="button has-tooltip-bottom" data-tooltip="Click to accept" onClick={() => {
            axios.post(`/friends/add`, { friend_id: player.id, approve: true })
        }}>
            <span className="icon">
                <FontAwesomeIcon icon={faTimes}/>
            </span>
            <span>Accept Friend Request</span>
        </div>
    }

    return <div className="button" onClick={() => {
        axios.post(`/friends/add`, { friend_id: player.id, approve: true })
    }}>
        <span className="icon">
            <FontAwesomeIcon icon={faPlus}/>
        </span>
        <span>Add Friend</span>
    </div>
}
