import { useState, useEffect, createContext } from 'react';
import { Navigate, NavLink, Link, Outlet } from 'react-router-dom'

import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loader from '../common/Loader'

import Styles from './AuthenticatedWrapper.module.sass'
// import { FontAwesomeIcon as FontAwesome6 } from '@fortawesome/react-fontawesome';
// import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export const UserContext = createContext({  });

export default function Authenticated({ ...props }){

    const [ state, setState ] = useState({ authenticated: 'loading' })

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
            <div className={Styles.Dashboard}>
                <UserContext.Provider value={[ state.user, function(user){ setState({ ...state, user }) } ]}>
                    <Sidebar user={state.user}/>
                    <div className={Styles.Application}>
                        <Outlet/>
                    </div>
                </UserContext.Provider>
            </div>
        )
    }

}

function Sidebar({ user, ...props }){

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
            <NavLink to="/campaigns" className={({ isActive }) => Styles.SidebarItem + (isActive?' '+Styles.isActive:'')}>
                <span>Campaigns</span>
            </NavLink>
            <NavLink to="/characters" className={({ isActive }) => Styles.SidebarItem + (isActive?' '+Styles.isActive:'')}>
                <span>Characters</span>
            </NavLink>
            <NavLink to="/friends" className={({ isActive }) => Styles.SidebarItem + (isActive?' '+Styles.isActive:'')}>
                <span>Friends</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => Styles.SidebarItem + (isActive?' '+Styles.isActive:'')}>
                <span>Settings</span>
            </NavLink>
            <Link to="/logout" className={Styles.SidebarItem}>
                {/* <span className="icon"><FontAwesome6 icon={faArrowRightFromBracket} size="sm"/></span> */}
                <span>Logout</span>
            </Link>
        </div>
    )

}