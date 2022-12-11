import { useState, useEffect, useContext } from "react"
import { Outlet, Link, Navigate, NavLink } from "react-router-dom"

import { FontAwesomeIcon as FontAwesome6 } from "@fortawesome/react-fontawesome"
import { faGears, faRightFromBracket, faHatWizard, faEnvelope, faUserGroup, faPlus, faUser } from "@fortawesome/free-solid-svg-icons"

import { getDatabase, ref, onValue } from "firebase/database"
import { updateProfile } from "firebase/auth"

import UserContext from "../context/User.jsx"

import ErrorBoundary from './ErrorBoundary.jsx'

import Watermark from "../images/logo.svg"

import ChooseAvatar from "pages/Characters/Components/ChooseAvatar.jsx"

import Styles from "./Dashboard.module.sass"

export default function Dashboard({ ...props }) {
    const [state, setState] = useState({
        showFriends: false,
        showSettings: false,
    })

    const [user] = useContext(UserContext)

    // Protect the route. Only authorized users can be in here!
    if (!(user && user.uid)) {
        console.log("Redirecting user to / because no user was found!")
        return <Navigate to="/" replace={true} />
    }

    return (
        <div className={Styles.Dashboard + (state.showFriends ? " " + Styles.friendsActive : "")}>
            <SettingsModal active={state.showSettings} closeModal={() => setState({ ...state, showSettings: false })} />
            <FriendsList />
            <Sidebar getState={[state, setState]} />
            <div className={Styles.Application}>
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </div>
            <Link className={Styles.watermark} to="/">
                <img src={Watermark} alt="NavarroTech" />
            </Link>
        </div>
    )
}

function Sidebar({ getState, ...props }) {
    const [user] = useContext(UserContext)
    const [state, setState] = getState

    return (
        <div className={Styles.Sidebar}>
            <div className={"nametag " + Styles.nametag}>
                <figure className="image is-64x64 is-rounded">
                    <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
                </figure>
                <div className="titles">
                    <p className="has-text-black has-text-weight-bold">{user.displayName}</p>
                    <p className="has-text-black">Level 1 Apprentice</p>
                </div>
            </div>
            <div className={"buttons is-centered has-addons " + Styles.sidebarButtons}>
                <button
                    className={"button is-" + (state.showFriends ? "primary" : "dark")}
                    type="button"
                    onClick={() => {
                        setState({ ...state, showFriends: !state.showFriends })
                    }}
                >
                    <span className="icon">
                        <FontAwesome6 icon={faUserGroup} />
                    </span>
                </button>
                <button
                    className={"button is-" + (state.showSettings ? "primary" : "dark")}
                    type="button"
                    onClick={() => {
                        setState({ ...state, showSettings: !state.showSettings })
                    }}
                >
                    <span className="icon">
                        <FontAwesome6 icon={faGears} />
                    </span>
                </button>
                <Link to="logout" className="button is-dark">
                    <span className="icon">
                        <FontAwesome6 icon={faRightFromBracket} />
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

function FriendsList({ ...props }) {
    const [state, setState] = useState({
        friends: [{ username: "Alex Navarro", photoURL: "https://lh3.googleusercontent.com/a-/AFdZucqCeVtwa2SaFFasbdIciOk840rZpYuBwP2OUqVm=s96-c", online: true }],
        addFriendModal: false,
        loading: true,
    })
    const [user] = useContext(UserContext)

    useEffect(() => {
        const unsubscribe = onValue(ref(getDatabase(), "user/" + user.uid + "/friends"), (snapshot) => {
            setState((state) => {
                return {
                    ...state,
                    loading: false,
                    // friends: snapshot.val() || []
                }
            })
        });
        return () => { unsubscribe(); }
    }, [user])

    if (state.loading) {
        return <div></div>
    }

    return (
        <div className={Styles.Friendslist}>
            <div className="block level">
                <div className="icon-text is-size-4">
                    <span className="icon mr-3">
                        <FontAwesome6 icon={faUserGroup} />
                    </span>
                    <span>Friends</span>
                </div>
                <div className="block buttons is-right">
                    <button
                        className="button is-primary is-rounded"
                        type="button"
                        onClick={() => {
                            setState({ addFriendModal: true })
                        }}
                    >
                        <span className="icon">
                            <FontAwesome6 icon={faPlus} />
                        </span>
                    </button>
                </div>
            </div>
            <div className={Styles.friends}>
                {state.friends &&
                    state.friends.map((friend) => {
                        // friend: { username: 'nebulablade', photoURL: '', online:true }
                        return (
                            <div className={Styles.myFriend} key={friend.username}>
                                <figure className="image is-48x48 is-rounded no-image">
                                    {/* <img src={friend.photoURL} alt={friend.username.substring(0, 1)} /> */}
                                    <span>{friend.username.split(' ').map(a => a.substring(0,1))}</span>
                                </figure>
                                <p>{friend.username}</p>
                            </div>
                        )
                    })}
            </div>
            {state.addFriendModal ? (
                <div className="modal is-active">
                    <div
                        className="modal-background"
                        onClick={() => {
                            setState({ addFriendModal: false })
                        }}
                    ></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Title</p>
                            <button
                                className="delete is-medium"
                                onClick={() => {
                                    setState({ addFriendModal: false })
                                }}
                            ></button>
                        </header>
                        <section className="modal-card-body"></section>
                        <footer className="modal-card-foot buttons is-right">
                            <button
                                className="button"
                                type="button"
                                onClick={() => {
                                    setState({ addFriendModal: false })
                                }}
                            >
                                <span>Cancel</span>
                            </button>
                            <button className="button is-primary" type="button">
                                <span>Add Friend</span>
                            </button>
                        </footer>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}

function SettingsModal({ active, closeModal, ...props }) {
    const [user, setUser] = useContext(UserContext)

    const [state, setState] = useState({
        showChooseAvatar: false,
        displayName: user.displayName,
        username: user.username||''
    })

    function save(update) {
        if (!update || !Object.keys(update).length) {
            return
        }
        updateProfile(user.auth.currentUser, update).catch((error) => console.log(error))
    }

    if(state.showChooseAvatar){
        return <ChooseAvatar
            current={user.photoURL}
            onChoose={(photoURL) => {
                if(photoURL){
                    save({ photoURL })
                    setUser({ ...user, photoURL })
                }
                setState({ ...state, showChooseAvatar: false })
            }}
        />
    }

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
                                <img src={user.photoURL} alt={user.displayName} />
                            </figure>
                        </div>

                        <div className="column">
                            <div className="field">
                                <label className="label">Your Full Name (Public)</label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Name"
                                        value={state.displayName}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.target.blur()
                                            }
                                        }}
                                        onChange={(e) => {
                                            setState({ ...state, displayName: e.target.value })
                                        }}
                                        onBlur={() => save({ displayName: state.displayName })}
                                    />
                                    <span className="icon is-left">
                                        <FontAwesome6 icon={faHatWizard} />
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Username</label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Username"
                                        value={state.username}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.target.blur()
                                            }
                                        }}
                                        onChange={(e) => {
                                            setState({ ...state, username: e.target.value })
                                        }}
                                        onBlur={() => save({ username: state.username })}
                                    />
                                    <span className="icon is-left">
                                        <FontAwesome6 icon={faUser} />
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Email Address</label>
                                <div className="control has-icons-left"  onClick={() => console.log(user)}>
                                    <input className="input" type="email" placeholder="Email" value={user.email} disabled={true}/>
                                    <span className="icon is-left">
                                        <FontAwesome6 icon={faEnvelope} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot buttons is-right">
                    <button className="button" type="button" onClick={closeModal}>
                        <span>Cancel</span>
                    </button>
                    <button className="button is-primary" type="button" onClick={closeModal}>
                        <span>Save</span>
                    </button>
                </footer>
            </div>
        </div>
    )
}
