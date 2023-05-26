import { useState } from "react"
import { Outlet, Link, Navigate, NavLink } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGears, faRightFromBracket, faHatWizard, faEnvelope, faUserGroup, faLock } from "@fortawesome/free-solid-svg-icons"

import ErrorBoundary from 'common/ErrorBoundary.jsx'

import Watermark from "../images/logo.svg"
import { useAppDispatch, useAppSelector } from "./redux"

import ChooseAvatar from "common/ChooseAvatar"

import axios from 'axios'
import Styles from "sass/Dashboard.module.sass"
import { setSettings } from "redux/app/reducer"
import PasswordStrengthBar from 'react-password-strength-bar';
import { setUser } from "redux/user/reducer"

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
            {/* <FriendsList /> */}
            <Sidebar />
            <div className={Styles.Application}>
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </div>
            <Link className={Styles.watermark} to="/campaigns">
                <img src={Watermark} alt="NavarroTech" crossOrigin="anonymous" />
            </Link>
        </div>
    )
}

function Sidebar() {
    const user = useAppSelector(state => state.user.user)
    const showFriends  = useAppSelector(state => state.app.showFriends)
    const showSettings = useAppSelector(state => state.app.showSettings)

    const dispatch = useAppDispatch()

    return (
        <div className={Styles.Sidebar}>
            <div className={"nametag " + Styles.nametag}>
                <figure className="image is-64x64 is-rounded">
                    <img src={user.photoURL} alt={user.name} referrerPolicy="no-referrer" crossOrigin="anonymous" />
                </figure>
                <div className="titles">
                    <p className="has-text-black has-text-weight-bold">{user.name}</p>
                    <p className="has-text-black">Level 1 Apprentice</p>
                </div>
            </div>
            <div className={"buttons is-centered has-addons " + Styles.sidebarButtons}>
                <button
                    className={"button is-" + (showFriends ? "primary" : "dark")}
                    type="button"
                    onClick={() => {
                        // dispatch(setFriends(!showFriends))
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

// function FriendsList() {
//     const user = useAppSelector(state => state.user.user)

//     const [state, setState] = useState({
//         friends: [
//             { username: "Alex Navarro", photoURL: "https://lh3.googleusercontent.com/a-/AFdZucqCeVtwa2SaFFasbdIciOk840rZpYuBwP2OUqVm=s96-c", online: true }
//         ],
//         addFriendModal: false,
//         loading: true,
//     })

//     useEffect(() => {
//         const unsubscribe = onValue(ref(getDatabase(), "user/" + user.uid + "/friends"), (snapshot) => {
//             setState((state) => {
//                 return {
//                     ...state,
//                     loading: false,
//                     // friends: snapshot.val() || []
//                 }
//             })
//         });
//         return () => { unsubscribe(); }
//     }, [user])

//     if (state.loading) {
//         return <div></div>
//     }

//     return (
//         <div className={Styles.Friendslist}>
//             <div className="block level">
//                 <div className="icon-text is-size-4">
//                     <span className="icon mr-3">
//                         <FontAwesomeIcon icon={faUserGroup} />
//                     </span>
//                     <span>Friends</span>
//                 </div>
//                 <div className="block buttons is-right">
//                     <button
//                         className="button is-primary is-rounded"
//                         type="button"
//                         onClick={() => {
//                             setState({ addFriendModal: true })
//                         }}
//                     >
//                         <span className="icon">
//                             <FontAwesomeIcon icon={faPlus} />
//                         </span>
//                     </button>
//                 </div>
//             </div>
//             <div className={Styles.friends}>
//                 {state.friends &&
//                     state.friends.map((friend) => {
//                         // friend: { username: 'nebulablade', photoURL: '', online:true }
//                         return (
//                             <div className={Styles.myFriend} key={friend.username}>
//                                 <figure className="image is-48x48 is-rounded no-image">
//                                     {/* <img src={friend.photoURL} alt={friend.username.substring(0, 1)} /> */}
//                                     <span>{friend.username.split(' ').map(a => a.substring(0,1))}</span>
//                                 </figure>
//                                 <p>{friend.username}</p>
//                             </div>
//                         )
//                     })}
//             </div>
//             {state.addFriendModal ? (
//                 <div className="modal is-active">
//                     <div
//                         className="modal-background"
//                         onClick={() => {
//                             setState({ addFriendModal: false })
//                         }}
//                     ></div>
//                     <div className="modal-card">
//                         <header className="modal-card-head">
//                             <p className="modal-card-title">Title</p>
//                             <button
//                                 className="delete is-medium"
//                                 onClick={() => {
//                                     setState({ addFriendModal: false })
//                                 }}
//                             ></button>
//                         </header>
//                         <section className="modal-card-body"></section>
//                         <footer className="modal-card-foot buttons is-right">
//                             <button
//                                 className="button"
//                                 type="button"
//                                 onClick={() => {
//                                     setState({ addFriendModal: false })
//                                 }}
//                             >
//                                 <span>Cancel</span>
//                             </button>
//                             <button className="button is-primary" type="button">
//                                 <span>Add Friend</span>
//                             </button>
//                         </footer>
//                     </div>
//                 </div>
//             ) : (
//                 <></>
//             )}
//         </div>
//     )
// }

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
                                <img src={user.photoURL} alt={user.name} crossOrigin="anonymous" />
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
