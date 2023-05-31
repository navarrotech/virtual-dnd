import { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import { get, getDatabase, onValue, ref, remove, set } from 'firebase/database'

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faArrowRight, faBan, faDownload, faPlus, faTimes, faUsersSlash } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as TreasureChest } from 'icons/treasure-chest.svg'

// Sub components
import Navbar from './components/Navbar'
import Inventory from './menu/Inventory'
import ChooseAvatar from "pages/Characters/Components/ChooseAvatar.jsx"

// Context
import CampaignContext, { CampaignProvider } from './CampaignContext.jsx'

// Global Components
import Loader from 'common/Loader'
import ErrorBoundary from 'widget/ErrorBoundary'
import Dropdown from 'common/Dropdown'

// Utility
import { downloadPDF } from 'utility/DownloadCharacterSheet'

import Styles from './_.module.sass'

export default function Wrapper(){
    return <div className={Styles.Game}>
        <ErrorBoundary>
            <CampaignProvider onlyOnce={true}>
                <Navbar />
                <ViewCharacter />
            </CampaignProvider>
        </ErrorBoundary>
    </div>
}

function kick(uid, campaign_id){
    remove(ref(getDatabase(), `/campaigns/${campaign_id}/players/${uid}`))
    set(ref(getDatabase(), `/campaigns/${campaign_id}/kicked/${uid}`), { when: new Date().toISOString() })
}
function ban(uid, campaign_id){
    let database = getDatabase()
    remove(ref(database, `/campaigns/${campaign_id}/players/${uid}`))
    set(ref(database, `/campaigns/${campaign_id}/banned/${uid}`), { when: new Date().toISOString() })
}
function friend(uid, friend_uid){
    set(ref(getDatabase(), `/accounts/${uid}/friends/${friend_uid}`), { status:"pending", when: new Date().toISOString() })
}
function unfriend(uid, friend_uid){
    remove(ref(getDatabase(), `/accounts/${uid}/friends/${friend_uid}`))
}

function ViewCharacter(){

    const navigate = useNavigate()
    const { isDungeonMaster=false, myUID } = useContext(CampaignContext)
    const [ state,  setState  ] = useState({ modal:'', health: 0, maxHealth: 0 })
    const [ player,  setPlayer  ] = useState(null)
    const [ friends, setFriends ] = useState(null)
    const { id, uid } = useParams()

    useEffect(() => {
        // Get the character
        const database = getDatabase()
        const reference = ref(database, `/campaigns/${id}/players/${uid}`)
        const unsubscribe = onValue(reference, (snapshot) => {
            let player = snapshot.val()
            setPlayer(player)
            setState(s => { return { ...s, maxHealth: player.current.maxHealth, health: player.current.health } })
        })
        
        // Get the current user's friend list
        get(ref(database, `/accounts/${myUID}/friends`))
            .then((snapshot) => { setFriends(snapshot.val()||{}) })

        return () => { unsubscribe(); }
    }, [ id, uid, myUID ])

    if(!player || !friends){ return <Loader /> }

    const isMyFriend = friends[uid] ? friends[uid].status : false

    const {
        player_name='',
        inventory,
        character: {
            name,
            image='',
            chatbanned=false,
            hidden=false,
            stats:{
                strength=0,
                strengthAdd=0,
                dexterity=0,
                dexterityAdd=0,
                charisma=0,
                charismaAdd=0,
                wisdom=0,
                wisdomAdd=0,
                intelligence=0,
                intelligenceAdd=0,
                constitution=0,
                constitutionAdd=0
            }
        }={}
    } = player

    return <section className="section">
        <div className="container is-max-fullhd">
            <div className="block level">
                <div className="level-left">
                    <figure className="image is-96x96 mr-4 is-rounded">
                        <img src={image} alt={name}/>
                    </figure>
                    <div>
                        <h1 className="title">{name}</h1>
                        <h2 className="subtitle">Played by {player_name}</h2>
                    </div>
                </div>
                <div className="block buttons is-right">
                    <Dropdown
                        trigger={<button className="button">
                            <span>Actions</span>
                            <span className="icon is-small">
                                <FontAwesomeIcon icon={faAngleDown}/>
                            </span>
                        </button>}>
                        { isDungeonMaster
                            ? <div className="dropdown-item is-clickable icon-text" onClick={() => { setState(s => { return { ...s, modal: 'inventory' } }) }}>
                                <span className="icon">
                                    <TreasureChest />
                                </span>
                                <span>View Inventory</span>
                            </div>
                            : <></>
                        }
                        <div className="dropdown-item is-clickable icon-text" onClick={() => downloadPDF(player.player_name, player.character)}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faDownload}/>
                            </span>
                            <span>Character Sheet</span>
                        </div>
                        { isMyFriend
                            ? <div className="dropdown-item is-clickable icon-text is-danger" onClick={() => {
                                unfriend(myUID, uid); let f = { ...friends }; delete f[uid]; setFriends(f)
                            }}>
                                { isMyFriend === 'pending'
                                    ? <>
                                        <span className="icon">
                                            <FontAwesomeIcon icon={faTimes}/>
                                        </span>
                                        <span>Unfriend</span>
                                    </>
                                    : <>
                                        <span className="icon">
                                            <FontAwesomeIcon icon={faUsersSlash}/>
                                        </span>
                                        <span>Unfriend</span>
                                    </>
                                }
                            </div>
                            : <div className="dropdown-item is-clickable icon-text" onClick={() => {
                                friend(myUID, uid); setFriends({ ...friends, uid:{ status:'pending' } })
                            }}>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faPlus}/>
                                </span>
                                <span>Add Friend</span>
                            </div>
                        }
                        { isDungeonMaster
                            ? <>
                                <div className="dropdown-item is-clickable icon-text is-danger" onClick={() => { kick(uid, id); navigate(`/play/${id}`); }}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </span>
                                    <span>Kick player</span>
                                </div>
                                <div className="dropdown-item is-clickable icon-text is-danger" onClick={() => { ban(uid, id); navigate(`/play/${id}`); }}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faBan}/>
                                    </span>
                                    <span>Ban player</span>
                                </div>
                            </>
                            : <>
                                {/* <div className="dropdown-item is-clickable icon-text is-danger" onClick={() => {  }}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faTriangleExclamation}/>
                                    </span>
                                    <span>Report Player</span>
                                </div> */}
                            </>
                        }
                    </Dropdown>
                    <Link className="button is-primary" to={`/play/${id}`}>
                        <span>Back To Game</span>
                        <span className="icon">
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </span>
                    </Link>
                </div>
            </div>
            <div className="block tags">
                { isMyFriend === 'active'  ? <span className="tag is-primary">Friends</span> : <></> }
                { isMyFriend === 'pending' ? <span className="tag is-warning">Requested Friendship</span> : <></> }
                { hidden ? <span className="tag is-danger">Hidden</span> : <></> }
                { chatbanned ? <span className="tag is-danger">Banned From Chat</span> : <></> }
            </div>
            <div className="block columns">
                <div className="column">
                    <BigStat label="Strength" small={strength} big={strengthAdd} />
                </div>
                <div className="column">
                    <BigStat label="Dexterity" small={dexterity} big={dexterityAdd} />
                </div>
                <div className="column">
                    <BigStat label="Charisma" small={charisma} big={charismaAdd} />
                </div>
                <div className="column">
                    <BigStat label="Wisdom" small={wisdom} big={wisdomAdd} />
                </div>
                <div className="column">
                    <BigStat label="Intelligence" small={intelligence} big={intelligenceAdd} />
                </div>
                <div className="column">
                    <BigStat label="Constitution" small={constitution} big={constitutionAdd} />
                </div>
                <div className="column is-3">
                    
                </div>
            </div>
            <div className="block columns">
                
                <div className="column is-two-fifths">
                    <div className="block box">
                        <label className="label box-label">Activity</label>
                    </div>
                </div>
                <div className="column is-three-fifths">
                    <div className="block box">
                        <label className="label box-label">Edit</label>
                        {/* <div className="level is-mobile">
                            <div className='w100'>
                                <p className="is-size-6"><strong>Current Health: {state.health} / {state.maxHealth}</strong></p>
                                <div className="is-relative">
                                    <input
                                        className="slider is-fullwidth is-success"
                                        step="1"
                                        min="0"
                                        max={state.maxHealth}
                                        value={state.health}
                                        onChange={({ target:{value} }) => {
                                            setState({ ...state, health:value })
                                        }}
                                        type="range"
                                    />
                                </div>
                            </div>
                            <div className="field pl-4">
                                <label className="label has-text-centered is-size-7">Max Health</label>
                                <div className="control">
                                    <input 
                                        className="input is-medium has-text-centered"
                                        type="text"
                                        placeholder=""
                                        value={state.maxHealth}
                                        onChange={({target:{value}}) => setState({ ...state, maxHealth: value })}
                                    />
                                </div>
                            </div>
                        </div> */}
                        <div className="field is-horizontal">
                            <div class="field-label is-normal">
                                <label className="label">Current Health</label>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <input 
                                        className="input has-text-centered"
                                        type="text"
                                        placeholder=""
                                        value={state.health}
                                        onChange={({target:{value}}) => setState({ ...state, health: value })}
                                    />
                                </div>
                            </div>
                            <div class="field-label is-normal">
                                <label className="label">Max Health</label>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <input 
                                        className="input has-text-centered"
                                        type="text"
                                        placeholder=""
                                        value={state.maxHealth}
                                        onChange={({target:{value}}) => setState({ ...state, maxHealth: value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="block columns">
                            
                            <div className="column">
                                <div className="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label className="label">Experience</label>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <input 
                                                className="input has-text-centered"
                                                type="number"
                                                placeholder=""
                                                value={state.health}
                                                onChange={({target:{value}}) => setState({ ...state, health: value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label className="label">Level</label>
                                    </div>
                                    <div className="field">
                                        <div className="control" data-tooltip="Every 1000xp is 1 level">
                                            <input 
                                                className="input has-text-centered"
                                                type="text"
                                                placeholder=""
                                                value={Math.floor(parseInt(state.experience) / 1000)+1}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label className="label">Speed</label>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <input 
                                                className="input has-text-centered"
                                                type="text"
                                                placeholder=""
                                                value={state.health}
                                                onChange={({target:{value}}) => setState({ ...state, health: value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label className="label">Armor Class</label>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <input 
                                                className="input has-text-centered"
                                                type="text"
                                                placeholder=""
                                                value={state.health}
                                                onChange={({target:{value}}) => setState({ ...state, health: value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label className="label">Gold</label>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <input 
                                                className="input has-text-centered"
                                                type="text"
                                                placeholder=""
                                                value={state.health}
                                                onChange={({target:{value}}) => setState({ ...state, health: value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label className="label">Initiative</label>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <input 
                                                className="input has-text-centered"
                                                type="text"
                                                placeholder=""
                                                value={state.health}
                                                onChange={({target:{value}}) => setState({ ...state, health: value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="block mt-0">
                            <label className="switch is-primary is-rounded mr-2">
                                <input type="checkbox" checked={hidden}/>
                                <span className="slider"></span>
                            </label>
                            <span className="mr-4">Hide from other players</span>
                            <label className="switch is-primary is-rounded mr-2">
                                <input type="checkbox" checked={chatbanned}/>
                                <span className="slider"></span>
                            </label>
                            <span>Banned from chat</span>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        { state.modal === 'inventory'
            ? <Inventory player_uid={uid} inventory={inventory} close={() => { setState(s => { return { ...s, modal: false } }) }}/>
            : <></>
        }
        { state.modal === 'avatar'
            ? <ChooseAvatar 
                current={image}
                onChoose={(image) => {
                    if(image){
                        set(ref(getDatabase(), `/campaigns/${id}/players/${uid}/character/image`), image)
                    }
                    setState(s => { return { ...s, page:'' } })
                }}/>
            : <></>
        }
    </section>
}

function BigStat({ label, big, small }){
    if(big > 0){ big = '+ '+big }
    return <div className={"block box " + Styles.BigStat}>
        <label className="box-label is-centered has-text-weight-bold is-capitalized">{label}</label>
        <div className="has-text-centered">
            <h1 className="title is-size-1">{big}</h1>
            <h2 className="subtitle is-size-6">{small}</h2>
        </div>
    </div>
}
