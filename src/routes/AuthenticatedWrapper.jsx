import { useState, useEffect, createContext, useContext } from 'react';
import { Navigate, NavLink, Link, Outlet } from 'react-router-dom'

import { getDatabase, ref, onValue } from 'firebase/database'
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { FontAwesomeIcon as FontAwesome6 } from '@fortawesome/react-fontawesome';
import { faUserGroup, faPlus, faRightFromBracket, faGears } from '@fortawesome/free-solid-svg-icons';

import Loader from '../common/Loader'

import Styles from './AuthenticatedWrapper.module.sass'
// import { FontAwesomeIcon as FontAwesome6 } from '@fortawesome/react-fontawesome';
// import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export const UserContext = createContext({  });

export default function Authenticated({ ...props }){

    const [ state, setState ] = useState({
        user: null,
        showFriends: false,
        authenticated: 'loading'
    })

    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if(!user) { console.log('User is not logged in, so redirecting to /login'); }
            setState(state => { return { ...state, authenticated: !!user, user }})
        });
    }, [])

    if(state.authenticated === 'loading'){ return <Loader /> }
    if(state.authenticated === false){ return <Navigate to="/" replace={true} /> }
    if(state.authenticated === true){
        return (
            <div className={Styles.Dashboard + (state.showFriends?' '+Styles.friendsActive:'')}>
                <UserContext.Provider value={[ state.user, function(user){ setState({ ...state, user }) } ]}>
                    <Sidebar user={state.user} getState={[ state, setState ]}/>
                    <div className={Styles.Application}>
                        <Outlet/>
                    </div>
                    <FriendsList/>
                </UserContext.Provider>
            </div>
        )
    }

}

function Sidebar({ user, getState, ...props }){

    const [state, setState] = getState

    return (
        <div className={Styles.Sidebar}>
            <div className={"nametag " + Styles.nametag}>
                <figure className="image is-64x64 is-rounded">
                    <img
                        src={ user.photoURL }
                        alt={ user.displayName }
                        referrerPolicy="no-referrer"
                    />
                </figure>
                <div className="titles">
                    <p>{ user.displayName }</p>
                    <p>Level 1 Apprentice</p>
                </div>
            </div>
            <div className={"buttons is-centered has-addons " + Styles.sidebarButtons}>
                <button className={"button " + (state.showFriends?'is-primary':'is-dark')} type="button" onClick={() => {console.log('clicked sidebar item'); setState({ ...state, showFriends: !state.showFriends })}}>
                    <span className="icon">
                        <FontAwesome6 icon={faUserGroup}/>
                    </span>
                </button>
                <button className="button is-dark" type="button">
                    <span className="icon">
                        <FontAwesome6 icon={faGears}/>
                    </span>
                </button>
                <Link to="logout" className="button is-dark">
                    <span className="icon">
                        <FontAwesome6 icon={faRightFromBracket}/>
                    </span>
                </Link>
            </div>
            <NavLink to="/campaigns" className={({ isActive }) => Styles.SidebarItem + (isActive?' '+Styles.isActive:'')}>
                <span>Campaigns</span>
            </NavLink>
            <NavLink to="/characters" className={({ isActive }) => Styles.SidebarItem + (isActive?' '+Styles.isActive:'')}>
                <span>Characters</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => Styles.SidebarItem + (isActive?' '+Styles.isActive:'')}>
                <span>Settings</span>
            </NavLink>
        </div>
    )

}

function FriendsList({ ...props }){

    const [ user ] = useContext(UserContext)
    const [ state, setState ] = useState({
        friends: [ { username: 'nebulablade', photoURL: 'https://lh3.googleusercontent.com/a-/AFdZucqCeVtwa2SaFFasbdIciOk840rZpYuBwP2OUqVm=s96-c', online:true } ],
        addFriendModal: false,
        loading: true
    });

    useEffect(() => {
        onValue(
            ref(getDatabase(), 'user/' + user.uid + '/friends'),
            (snapshot) => {
                setState(state => {
                    return {
                        ...state,
                        loading:false,
                        // friends: snapshot.val() || []
                    }
                })
            }
        )
    }, [user])

    if(state.loading){ return <div></div> }
    
    return (
        <div className={Styles.Friendslist}>
            <div className="block level">
                <div className="icon-text is-size-4">
                    <span className="icon mr-3">
                        <FontAwesome6 icon={faUserGroup}/>
                    </span>
                    <span>Friends</span>
                </div>
                <div className="block buttons is-right">
                    <button className="button is-primary is-rounded" type="button" onClick={() => { setState({ addFriendModal:true }) }}>
                        <span className="icon">
                            <FontAwesome6 icon={faPlus}/>
                        </span>
                    </button>
                </div>
            </div>
            <div className={Styles.friends}>
                { state.friends && state.friends.map(friend => {
                    // friend: { username: 'nebulablade', photoURL: '', online:true }
                    return <div className={Styles.myFriend} key={friend.username}>
                        <figure className="image is-48x48 is-rounded">
                            <img src={ friend.photoURL } alt={ friend.username }/>
                        </figure>
                        <p>{ friend.username }</p>
                    </div>
                }) }
            </div>
            { state.addFriendModal
                ? <div className="modal is-active">
                    <div className="modal-background" onClick={() => { setState({ addFriendModal: false }) }}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Title</p>
                            <button className="delete is-medium" onClick={() => { setState({ addFriendModal: false }) }}></button>
                        </header>
                        <section className="modal-card-body">
                            
                        </section>
                        <footer className="modal-card-foot buttons is-right">
                            <button className="button" type="button" onClick={() => { setState({ addFriendModal: false }) }}>
                                <span>Cancel</span>
                            </button>
                            <button className="button is-primary" type="button">
                                <span>Add Friend</span>
                            </button>
                        </footer>
                    </div>
                </div>
                : <></>
            }
        </div>
    )

}
