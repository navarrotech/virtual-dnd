import { useState, useEffect } from 'react'
import { Navigate, Route, Link } from 'react-router-dom'

import {
    getAuth, signOut,
    onAuthStateChanged, updateProfile,
    GoogleAuthProvider, signInWithPopup,
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "firebase/auth";

// Icons + Images
import { FontAwesomeIcon as FontAwesome6 } from '@fortawesome/react-fontawesome'
import { faArrowRight, faEnvelope, faLock, faPlus } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as GoogleIcon } from '../images/brands/google_g.svg'
import Logo from '../Logo.svg'

import Loader from '../common/Loader'

export function AuthPanel({ ...props }){

    const [ state, setState ] = useState({
        redirect: false,
        mode: props.mode?props.mode:'login',
        name:'',
        email: '',
        password: '',
        GoogleButtonLoading: false,
        NativeButtonLoading: false
    })

    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            setState(state => { state.redirect = !!user; return state; })
        });
    }, [])

    function GoogleSignin(){
        setState({ ...state, GoogleButtonLoading: true })
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
            .then((result) => {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // const user = result.user;
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log({ errorCode, errorMessage, email, credential })
            }).finally(() => {
                setState({ ...state, GoogleButtonLoading: false, redirect: true })
            });
    }

    function NativeSignin(){
        const auth = getAuth()
        const { email, password } = state;

        setState({ ...state, NativeButtonLoading: true })

        if(state.mode === 'login'){
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // const user = userCredential.user;
                })
                .catch((error) => {
                    console.log({ errorCode: error.code, message: error.message })
                })
                .finally(() => {
                    setState({ ...state, NativeButtonLoading: false, redirect: true })
                });
        }
        else if(state.mode === 'signup'){
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    return updateProfile(user, {
                        displayName: state.name,
                        photoURL: "/images/user.svg"
                    })
                })
                .catch((error) => {
                    console.log({ errorCode: error.code, message: error.message })
                })
                .finally(() => {
                    setState({ ...state, NativeButtonLoading: false, redirect: true })
                });
        }
    }

    if(state.redirect){
        return <Navigate to="/campaigns"/>
    }

    return (<>
        <div className="block has-text-centered">
            <h1 className="title">{ state.mode === 'login' ? 'Login' : 'Sign Up' }</h1>
            { state.mode === 'login'
                ? <h2 className="subtitle">Or <span className="has-text-primary is-clickable" onClick={() => { setState({ ...state, mode:'signup' }) }}>signup for free</span></h2>
                : <h2 className="subtitle">Or <span className="has-text-primary is-clickable" onClick={() => { setState({ ...state, mode:'login'  }) }}>login now</span></h2>
            }
        </div>
        <div className="block">
            <button className={"button is-google is-fullwidth" + (state.GoogleButtonLoading?' is-loading':'')} type="button" onClick={GoogleSignin}>
                <span className="icon">
                    <GoogleIcon />
                </span>
                { state.mode==='login'
                    ? <span>Sign in with Google</span>
                    : <span>Sign up with Google</span>
                }
            </button>
        </div>
        <div className="is-divider" data-content="OR"></div>
        <div className="block">
            { state.mode === 'signup'
                ? <div className="field">
                    <div className="control has-icons-left">
                        <input
                            autoFocus={state.mode === 'signup'}
                            className="input"
                            type="text"
                            placeholder="Full Name"
                            // autoComplete="email"
                            value={state.name}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter'){ NativeSignin() }
                            }}
                            onChange={(e) => {
                                setState({ ...state, name: e.target.value })
                            }}
                        />
                        <span className="icon is-left">
                            <FontAwesome6 icon={faEnvelope}/>
                        </span>
                    </div>
                </div>
                : <></>
            }
            <div className="field">
                <div className="control has-icons-left">
                    <input
                        autoFocus={state.mode === 'login'}
                        className="input"
                        type="email"
                        placeholder="Email"
                        // autoComplete="email"
                        value={state.email}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter'){ NativeSignin() }
                        }}
                        onChange={(e) => {
                            setState({ ...state, email: e.target.value })
                        }}
                    />
                    <span className="icon is-left">
                        <FontAwesome6 icon={faEnvelope}/>
                    </span>
                </div>
            </div>
            <div className="field">
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="password"
                        placeholder="Password"
                        // autoComplete="password"
                        value={state.password}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter'){ NativeSignin() }
                        }}
                        onChange={(e) => {
                            setState({ ...state, password: e.target.value })
                        }}
                    />
                    <span className="icon is-left">
                        <FontAwesome6 icon={faLock}/>
                    </span>
                </div>
            </div>
            { state.mode === 'login'
                ? <div className="field level also-mobile">
                    <p className="is-size-6">&nbsp;</p>
                    <Link to="/forgot" className="is-size-6 has-text-primary">Forgot Password?</Link>
                </div>
                : <></>
            }
        </div>
        <div className="block buttons is-centered">
            <button
                onClick={() => NativeSignin()}
                disabled={state.email && state.email.includes('@') && state.password.length > 8 && (state.mode === 'signup'?!!state.name:true)}
                className={"button is-primary is-fullwidth" + (state.NativeButtonLoading?' is-loading':'')} 
                type="button"
            >
                { state.mode==='login'
                    ? <><span>Login</span><span className="icon"><FontAwesome6 icon={faArrowRight}/></span></>
                    : <><span>Sign Up</span><span className="icon"><FontAwesome6 icon={faPlus}/></span></>
                }
            </button>
        </div>
    </>)

}

export function Logout({ ...props }){

    const [ done, setDone ] = useState(false)

    useEffect(() => {
        const auth = getAuth();
        signOut(auth)
        .catch((error) => { console.log(error) })
        .finally(() => { setDone(true) })
    }, [])

    if(done){ return <Navigate to="/"/> }

    return ( <Loader fullpage={true}/> )
}

export function AuthPage({ mode, ...props }){

    return (
        <div className="hero is-halfheight">
            <div className="hero-body">
                <div className="container is-max-fullhd">
                    <div className="subcontainer is-mini">
                        <figure className="block image is-128x128 is-centered">
                            <img src={Logo} alt="Virtual DnD"/>
                        </figure>
                        <div className="block box">
                            <AuthPanel mode={mode}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export function Forgot({ ...props }){
    
    const [state, setState] = useState({
        email: '',
        finished: false
    });

    function submit(){
        const { email } = state
        const auth = getAuth();

        if(!email || email.includes('@')){ return; }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setState({ ...state, finished:true })
            })
            .catch((error) => { console.log({ errorCode: error.code, message:error.message }) });
    }

    if(state.finished){
        return (
            <div className="hero is-halfheight">
                <div className="hero-body">
                    <div className="container is-max-fullhd">
                        <div className="subcontainer is-mini">
                            <figure className="block image is-128x128 is-centered">
                                <img src={Logo} alt="Virtual DnD"/>
                            </figure>
                            <div className="block box">
                                <div className="block has-text-centered">
                                    <h1 className="title">An email has been sent to your account</h1>
                                </div>
                                <div className="block">
                                    <p className="is-size-5">Please check your email for instructions to reset your password.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="hero is-halfheight">
            <div className="hero-body">
                <div className="container is-max-fullhd">
                    <div className="subcontainer is-mini">
                        <figure className="block image is-128x128 is-centered">
                            <img src={Logo} alt="Virtual DnD"/>
                        </figure>
                        <div className="block box">
                            <div className="block">
                                <h1 className="title">Forgot Password</h1>
                                <h2 className="subtitle">Enter your email address to reset your password</h2>
                            </div>
                            <div className="block">
                                <div className="field">
                                    <div className="control">
                                        <input
                                            autoFocus
                                            className="input"
                                            type="email"
                                            placeholder="Email"
                                            // autoComplete="email"
                                            value={state.email}
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter'){ submit() }
                                            }}
                                            onChange={(e) => {
                                                setState({ ...state, email: e.target.value })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="block buttons is-centered">
                                <button
                                    className="button is-primary is-fullwidth"
                                    disabled={!(state.email && state.email.includes('@'))}
                                    onClick={submit}
                                    type="button" 
                                >
                                    <span>Send Reset Instructions</span>
                                    <span className="icon">
                                        <FontAwesome6 icon={faEnvelope}/>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default <>
    <Route index path="/"       element={ <AuthPage mode="login"/>  }/>
    <Route index path="/login"  element={ <AuthPage mode="login"/>  }/>
    <Route index path="/signup" element={ <AuthPage mode="signup"/> }/>
    <Route index path="/forgot" element={ <AuthPage mode="forgot"/> }/>
    <Route index path="/logout" element={ <Logout /> }/>
</>