import { useState, useEffect, useContext, useRef } from "react"
import { Outlet, Link, Navigate, NavLink } from "react-router-dom"

import { FontAwesomeIcon as FontAwesome6 } from "@fortawesome/react-fontawesome"
import { faGears, faRightFromBracket, faHatWizard, faEnvelope, faUserGroup, faPlus, faUser } from "@fortawesome/free-solid-svg-icons"

import { Image } from "image-js"
import ReactCrop from "react-image-crop"
import "react-image-crop/src/ReactCrop.scss"

import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import { getDatabase, ref, onValue } from "firebase/database"
import { updateProfile } from "firebase/auth"

import UserContext from "../context/User.jsx"

import Loader from "../common/Loader.jsx"
import Watermark from "../images/logo.svg"

import Styles from "../styles/Dashboard.module.sass"

export default function Dashboard({ ...props }) {
    const [state, setState] = useState({
        showFriends: false,
        showSettings: false,
    })

    const [user] = useContext(UserContext)

    // Protect the route. Only authorized users can be in here!
    if (!(user && user.uid)) {
        return <Navigate to="/" replace={true} />
    }

    return (
        <div className={Styles.Dashboard + (state.showFriends ? " " + Styles.friendsActive : "")}>
            <SettingsModal active={state.showSettings} closeModal={() => setState({ ...state, showSettings: false })} />
            <FriendsList />
            <Sidebar getState={[state, setState]} />
            <div className={Styles.Application}>
                <Outlet />
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
        friends: [{ username: "nebulablade", photoURL: "https://lh3.googleusercontent.com/a-/AFdZucqCeVtwa2SaFFasbdIciOk840rZpYuBwP2OUqVm=s96-c", online: true }],
        addFriendModal: false,
        loading: true,
    })
    const [user] = useContext(UserContext)

    useEffect(() => {
        onValue(ref(getDatabase(), "user/" + user.uid + "/friends"), (snapshot) => {
            setState((state) => {
                return {
                    ...state,
                    loading: false,
                    // friends: snapshot.val() || []
                }
            })
        })
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
                                <figure className="image is-48x48 is-rounded">
                                    <img src={friend.photoURL} alt={friend.username} />
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
    const [crop, setCrop] = useState({
        unit: "px",
        width: 64,
        height: 64,
        x: 25,
        y: 25,
    })
    const [state, setState] = useState({
        file: null,
        files: [],
        filePreview: "",
        uploading: false,
        cropModal: false,
        displayName: user.displayName,
        username: user.username||''
    })

    const fileInput = useRef()

    function save(update) {
        if (!update || !Object.keys(update).length) {
            return
        }
        updateProfile(user.auth.currentUser, update).catch((error) => console.log(error))
    }

    function upload() {
        const { file } = state
        const storage = getStorage()
        const filereader = new FileReader()
        const storageReference = storageRef(storage, `/user/${user.uid}/profile.png`)

        setState({
            ...state,
            cropModal: false,
            file: null,
            filePreview: null,
            uploading: true,
        })

        filereader.onload = function () {
            Image.load(filereader.result)
                .then(function (image) {
                    const x = image.width * (crop.x / 100),
                        y = image.height * (crop.y / 100),
                        width = image.width * (crop.width / 100),
                        height = image.height * (crop.height / 100)

                    return image
                        .crop({
                            x,
                            y,
                            width,
                            height,
                        })
                        .toBlob()
                })
                .then((image) => {
                    setCrop({
                        unit: "%",
                        width: 50,
                        height: 50,
                        x: 25,
                        y: 25,
                    })
                    return uploadBytes(storageReference, image)
                })
                .then((snapshot) => {
                    setState({ uploading: false })
                    return getDownloadURL(storageReference)
                })
                .then((photoURL) => {
                    setUser({ ...user, photoURL })
                    return save({ photoURL })
                })
        }
        filereader.readAsArrayBuffer(file)
    }

    function startCrop([file]) {
        if (!file) {
            return
        }

        const megabyte = 1048576
        if (file.size > megabyte * 2) {
            return
        }

        let reader = new FileReader()
        reader.onload = function () {
            setState({
                ...state,
                cropModal: true,
                file,
                filePreview: reader.result,
            })
        }
        reader.readAsDataURL(file)
    }

    if (state.cropModal) {
        return (
            <div className="modal is-active">
                <div
                    className="modal-background"
                    onClick={() => {
                        setState({ ...state, cropModal: false })
                    }}
                ></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Crop Image</p>
                        <button
                            className="delete is-medium"
                            onClick={() => {
                                setState({ ...state, cropModal: false })
                            }}
                        ></button>
                    </header>
                    <section className="modal-card-body">
                        <div className="block mx-auto">
                            <ReactCrop minWidth={64} aspect={1} keepSelection={true} crop={crop} onChange={(pixels, percent) => setCrop(percent)}>
                                <img src={state.filePreview} alt="Thumbnail Preview" />
                            </ReactCrop>
                        </div>
                    </section>
                    <footer className="modal-card-foot buttons is-right">
                        <button
                            className="button"
                            type="button"
                            onClick={() => {
                                setState({ ...state, cropModal: false })
                            }}
                        >
                            <span>Cancel</span>
                        </button>
                        <button className="button is-primary" type="button" onClick={upload}>
                            <span>Save</span>
                        </button>
                    </footer>
                </div>
            </div>
        )
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
                                onClick={() => {
                                    fileInput && fileInput.current && fileInput.current.click()
                                }}
                            >
                                {state.uploading ? <Loader size="128px" /> : <img src={user.photoURL} alt={user.displayName} />}
                            </figure>
                            <input
                                ref={fileInput}
                                accept="image/png, image/jpeg"
                                type="file"
                                onChange={(e) => {
                                    setState({ files: e.target.files })
                                    startCrop(e.target.files)
                                }}
                                className="is-hidden"
                            />
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
                                <div className="control has-icons-left">
                                    <input className="input" type="email" placeholder="Email" value={user.email} disabled={true} />
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
                    <button className="button is-primary" type="button">
                        <span>Save</span>
                    </button>
                </footer>
            </div>
        </div>
    )
}
