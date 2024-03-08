import { useState } from "react"
import { Outlet, Link, Navigate, NavLink } from "react-router-dom"

// Typescript
import type { MinimalUser } from "redux/user/types"

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGears, faRightFromBracket, faHatWizard, faEnvelope, faUserGroup, faLock, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons"

// Common
import ErrorBoundary from 'common/ErrorBoundary.jsx'
import Loader from "common/Loader"
import Watermark from "images/logo.svg"
import ChooseAvatar from "common/ChooseAvatar"
import NameTag from "common/NameTag"

// Redux
import { shallowEqual, useStore } from "react-redux"
import { useAppDispatch, useAppSelector } from "./redux"
import { setSettings, setFriends } from "redux/app/reducer"
import { setUser } from "redux/user/reducer"

// Utility
import axios from 'axios'
import { Portal } from 'react-portal';
import PasswordStrengthBar from 'react-password-strength-bar';

// Custom hooks
import useDebouncedAxiosSearch from "hooks/useDebouncedAxiosSearch"

// Styles
import Styles from "sass/Dashboard.module.sass"

const bodyElement = document.querySelector('body')
const API_URL = import.meta.env.VITE_API_DOMAIN

export default function Dashboard() {
    const showFriends  = useAppSelector(state => state.app.showFriends)
    const isAuthorized = useAppSelector(state => state.user.authorized)

    // Protect the route. Only authorized users can be in here!
    if(!isAuthorized){
        console.log("Redirecting user to /login because they are not authorized!")
        return <Navigate to="/login" replace={true} />
    }

    return (
        <div className={Styles.Dashboard + (showFriends ? " " + Styles.friendsActive : "")}> 
            <SettingsModal />
            <FriendsList />
            <Sidebar />
            <div className={Styles.Application}>
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </div>
            <div className={Styles.watermark}>
                <WaterMark />
            </div>
        </div>
    )
}

function WaterMark(){
    const store = useStore()
    
    return <img
        src={Watermark}
        alt="NavarroTech"
        crossOrigin="anonymous"
        onClick={() => console.log(store.getState())}
    />
}

function Sidebar() {
    const showFriends  = useAppSelector(state => state.app.showFriends)
    const showSettings = useAppSelector(state => state.app.showSettings)

    const dispatch = useAppDispatch()

    return (
        <div className={Styles.Sidebar}>
            <NameTag onClick={() => dispatch(setSettings(!showSettings))} />
            <div className={"buttons is-centered has-addons " + Styles.sidebarButtons}>
                <button
                    className={"button is-" + (showFriends ? "primary" : "dark")}
                    type="button"
                    onClick={() => {
                        dispatch(setFriends(!showFriends))
                    }}
                >
                    <span className="icon">
                        <FontAwesomeIcon icon={faUserGroup} />
                    </span>
                </button>
                <button
                    className={"button is-" + (showSettings ? "primary" : "dark")}
                    type="button"
                    onClick={() => {
                        dispatch(setSettings(!showSettings))
                    }}
                >
                    <span className="icon">
                        <FontAwesomeIcon icon={faGears} />
                    </span>
                </button>
                <Link to="logout" className="button is-dark">
                    <span className="icon">
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </span>
                </Link>
            </div>
            <NavLink to="/campaigns" className={({ isActive }) => Styles.SidebarItem + (isActive ? " " + Styles.isActive : "")}>
                <span>Campaigns</span>
            </NavLink>
            <NavLink to="/characters" className={({ isActive }) => Styles.SidebarItem + (isActive ? " " + Styles.isActive : "")}>
                <span>Characters</span>
            </NavLink>
        </div>
    )
}

function AddFriendModal({ closeModal }: { closeModal: () => any }){

    const { search, loading, text, setText, result } = useDebouncedAxiosSearch(`/friends/find`, 500)
    const foundUsers: MinimalUser[] = result as MinimalUser[] || []

    const me = useAppSelector(state => state.user.user)
    const friendsMap = useAppSelector(state => state.user.friendsMap)
    const friendRequestsMap = useAppSelector(state => state.user.friendsMap)

    function add(friend_id: string){
        return async () => {
            await axios.post(`/friends/add`, {
                friend_id, approve: true
            })

            closeModal()
        }
    }

    return <div className="modal is-active">
        <div
            className="modal-background"
            onClick={closeModal}
        />
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">Add a friend</p>
                <button
                    className="delete is-medium"
                    onClick={closeModal}
                ></button>
            </header>
            <section className="modal-card-body">
                <div className="field has-addons">
                    <div className="control is-expanded">
                        <input
                            className="input"
                            type="text"
                            placeholder="You can add friends with their email address"
                            value={text}
                            onChange={({ target:{ value } }) => setText(value)}
                            onKeyDown={({ key }) => {
                                if(['Enter', 'Esc', 'Escape'].includes(key)){
                                    search()
                                }
                            }}
                        />
                    </div>
                    <div className="control">
                        <button className="button is-primary" type="button" onClick={() => search()}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faSearch}/>
                            </span>
                        </button>
                    </div>
                </div>
                { loading
                    ? <Loader size="100px" />
                    : foundUsers.map(user => {
                        const friend = friendsMap[user.id]
                        const friendRequested = friendRequestsMap[user.id]
                        const alreadyFriendRequested = friend.friend_req_ids.includes(me.id)

                        return <div key={user.id} className="block level">
                        <div className="level-left">
                            <figure className="image is-48x48 is-rounded mr-2">
                                <img src={API_URL + '/' + user.photoURL} alt="" crossOrigin="anonymous" />
                            </figure>
                            <div>
                                <h1 className="title is-size-6">{ user.first_name } { user.last_name }</h1>
                                <h2 className="subtitle is-size-7">{ user?.email } | { user.online ? '🟢 Online now' : '💤 Away' }</h2>
                            </div>
                        </div>
                        <button className="button is-primary is-small" type="button" disabled={!!friend || alreadyFriendRequested} onClick={add(user.id)}>
                            <span>
                                { friend
                                    ? 'Already friends'
                                    : friendRequested
                                        ? 'Accept request'
                                        : alreadyFriendRequested
                                            ? 'Request sent'
                                            : 'Add friend'
                                }
                            </span>
                            <span className="icon">
                                <FontAwesomeIcon icon={faPlus} />
                            </span>
                        </button>
                    </div>
                    })
                }
                { result !== undefined && foundUsers.length === 0 && !loading
                    ? <p className="has-text-centered">No users with that email were found</p>
                    : null
                }
            </section>
            <footer className="modal-card-foot buttons is-right">
                <button
                    className="button"
                    type="button"
                    onClick={closeModal}
                >
                    <span>Close</span>
                </button>
            </footer>
        </div>
    </div>
}

function FriendsList() {

    const friends = useAppSelector(state => state.user.friends, shallowEqual)
    const friend_requests = useAppSelector(state => state.user.friend_requests, shallowEqual)

    function accept(friend_id: string, approve: boolean): any {
        return async () => {
            await axios.post(`/friends/add`, { friend_id, approve })
        }
    }

    const [ showModal, setShowModal ] = useState(false)

    return (
        <div className={Styles.Friendslist}>
            <div className="block level">
                <div className="icon-text is-size-4">
                    <span className="icon mr-3">
                        <FontAwesomeIcon icon={faUserGroup} />
                    </span>
                    <span>Friends</span>
                </div>
                <div className="block buttons is-right">
                    <button
                        className="button is-primary is-rounded"
                        type="button"
                        onClick={() => setShowModal(true)}
                    >
                        <span className="icon">
                            <FontAwesomeIcon icon={faPlus} />
                        </span>
                    </button>
                </div>
            </div>
            <div className={Styles.friends}>
                { friend_requests.length
                    ? <div>
                        <div className="is-divider" data-content="Friend Requests"></div>
                    </div>
                    : <></>
                }
                { 
                    friend_requests.map((friend) => <div className={'field ' + Styles.myFriend} key={friend.id}>
                        <figure className="image is-48x48 is-rounded">
                            <img src={API_URL + '/' + friend.photoURL} alt={friend.first_name} crossOrigin="anonymous" />
                        </figure>
                        <div>
                            <h2 className='title is-size-5'>{ friend.first_name } { friend.last_name }</h2>
                            <h3 className='subtitle is-size-7'>
                                <a className='link is-primary' onClick={accept(friend.id, true)}>
                                    <u>Accept Friend</u>
                                </a>
                                {'  |  '}
                                <a className='link is-primary' onClick={accept(friend.id, false)}>
                                    <u>Reject Request</u>
                                </a>
                            </h3>
                        </div>
                    </div>)
                }
                { friends.length && friend_requests.length
                    ? <div>
                        <div className="is-divider" data-content="Friends"></div>
                    </div>
                    : <></>
                }
                { 
                    friends.map((friend) => <div className={'field ' + Styles.myFriend} key={friend.id} style={{ opacity: friend.online ? 1 : 0.5 }}>
                        <figure className="image is-48x48 is-rounded">
                            <img src={API_URL + '/' + friend.photoURL} alt={friend.first_name} crossOrigin="anonymous" />
                        </figure>
                        <div>
                            <h2 className='title is-size-5'>{ friend.first_name } { friend.last_name }</h2>
                            <h3 className='subtitle is-size-7'>{ friend.online ? '🟢 Online' : '💤 Offline' }</h3>
                        </div>
                    </div>)
                }
                { !friend_requests.length && !friends.length
                    ? <>
                        <h1 className="title is-size-5">You have no friends yet!</h1>
                        <p>Click the add button above to add your first friend, so you can join campaigns and share characters together.</p>
                    </>
                    : <></>
                }
            </div>
            { showModal 
                ? <Portal node={bodyElement}>
                    <AddFriendModal closeModal={() => setShowModal(false)} />
                </Portal>
                : <></>
            }
        </div>
    )
}

function SettingsModal() {

    const user = useAppSelector(state => state.user.user)
    const active = useAppSelector(state => state.app.showSettings)

    const dispatch = useAppDispatch()

    const [state, setState] = useState({
        showChooseAvatar: false,
        first_name: user.first_name || '',
        last_name:  user.last_name || '',
        password: ''
    })

    if(state.showChooseAvatar){
        return <ChooseAvatar
            current={user.photoURL}
            onChoose={async (photoURL) => {
                if(photoURL){
                    photoURL = photoURL.replace(API_URL, '')
                    const user = await axios.post(`/auth/update`, { photoURL })
                    dispatch(setUser(user.data))
                }
                setState({ ...state, showChooseAvatar: false })
            }}
        />
    }

    function closeModal(){
        dispatch(setSettings(false))
    }

    async function save(){
        const data: any = {}
        if(state.first_name !== user.first_name){
            data.first_name = state.first_name
        }
        if(state.last_name !== user.last_name){
            data.last_name = state.last_name
        }
        if(state.password !== ''){
            data.password = state.password
        }
        const newUser = await axios.post(`/auth/update`, data)
        dispatch(setUser(newUser.data))
        closeModal()
        return null;
    }

    const isSaveDisabled = !!(!state.first_name || !state.last_name || (state.password && state.password.length < 8))

    return (
        <div className={"modal" + (active ? " is-active" : "")}>
            <div className="modal-background" onClick={closeModal}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Account Settings</p>
                    <button className="delete is-medium" onClick={closeModal}></button>
                </header>
                <section className="modal-card-body">
                    <div className="columns is-vcentered">
                        <div className="column is-3">
                            <figure
                                className="image is-128x128 is-centered is-rounded is-clickable"
                                onClick={() => { setState({ ...state, showChooseAvatar: true }) }}
                            >
                                <img src={API_URL + '/' + user.photoURL} alt={user.name} crossOrigin="anonymous" />
                            </figure>
                        </div>

                        <div className="column">
                            <label className="label">Name</label>
                            <div className="field has-addons">
                                <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="First Name"
                                        value={state.first_name}
                                        onKeyDown={(e: any) => {
                                            if (e.key === "Enter") {
                                                e.target.blur()
                                            }
                                        }}
                                        onChange={(e) => {
                                            setState({ ...state, first_name: e.target.value })
                                        }}
                                    />
                                    <span className="icon is-left">
                                        <FontAwesomeIcon icon={faHatWizard} />
                                    </span>
                                </div>
                                <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Last name"
                                        value={state.last_name}
                                        onKeyDown={(e: any) => {
                                            if (e.key === "Enter") {
                                                e.target.blur()
                                            }
                                        }}
                                        onChange={(e) => {
                                            setState({ ...state, last_name: e.target.value })
                                        }}
                                    />
                                    <span className="icon is-left">
                                        <FontAwesomeIcon icon={faHatWizard} />
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Set A New Password</label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="password"
                                        placeholder="Password"
                                        value={state.password}
                                        onKeyDown={(e: any) => {
                                            if (e.key === "Enter") {
                                                e.target.blur()
                                            }
                                        }}
                                        onChange={({ target:{ value } }) => setState({ ...state, password: value })}
                                    />
                                    <span className="icon is-left">
                                        <FontAwesomeIcon icon={faLock} />
                                    </span>
                                </div>
                            </div>
                            { state.password
                                ? <PasswordStrengthBar password={state.password} />
                                : <></>
                            }
                            <div className="field">
                                <label className="label">Email Address</label>
                                <div className="control has-icons-left">
                                    <input className="input" type="email" placeholder="Email" value={user.email} disabled={true}/>
                                    <span className="icon is-left">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                </div>
                            </div>
                            { isSaveDisabled
                                ? <>
                                    { !state.first_name
                                        ? <p className="notification is-danger">First name is required!</p>
                                        : <></>
                                    }
                                    { !state.last_name
                                        ? <p className="notification is-danger">Last name is required!</p>
                                        : <></>
                                    }
                                    { state.password && state.password.length < 8
                                        ? <p className="notification is-danger">New password must be at least 8 characters long!</p>
                                        : <></>
                                    }
                                </>
                                : <></>
                            }
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot buttons is-right">
                    <button className="button" type="button" onClick={closeModal}>
                        <span>Cancel</span>
                    </button>
                    <button className="button is-primary" type="button" onClick={save} disabled={isSaveDisabled}>
                        <span>Save</span>
                    </button>
                </footer>
            </div>
        </div>
    )
}
