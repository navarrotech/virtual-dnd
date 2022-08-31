import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut } from "firebase/auth";

import { FontAwesomeIcon as FontAwesome6 } from '@fortawesome/react-fontawesome'
import { faArrowRight, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

import { Route } from 'react-router';

import Loader from '../common/Loader'
import Logo from '../Logo.svg'

export function AuthPanel({ ...props }){

    const [ state, setState ] = useState({
        mode: props.mode?props.mode:'login'
    })

    function GoogleSignin(){
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log({ token, user })
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);

                console.log({ errorCode, errorMessage, email, credential })
            });
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
            <button className="button is-google is-fullwidth" type="button" onClick={GoogleSignin}>
                <span className="icon">
                    
                </span>
                <span>Sign in with Google</span>
            </button>
        </div>
        <div className="is-divider" data-content="OR"></div>
        <div className="block">
            <div className="field">
                <div className="control has-icons-left">
                    <input className="input" type="email" placeholder="Email" autoComplete="email"/>
                    <span className="icon is-left">
                        <FontAwesome6 icon={faEnvelope}/>
                    </span>
                </div>
            </div>
            <div className="field">
                <div className="control has-icons-left">
                    <input className="input" type="password" placeholder="Password" autoComplete="password"/>
                    <span className="icon is-left">
                        <FontAwesome6 icon={faLock}/>
                    </span>
                </div>
            </div>
            <div className="field level also-mobile">
                <p className="is-size-6">&nbsp;</p>
                <p onClick={() => { setState({ ...state, mode:'forgot' }) }} className="is-size-6 is-clickable has-text-primary">Forgot Password?</p>
            </div>
        </div>
        <div className="block buttons is-centered">
            <button className="button is-primary is-fullwidth" type="button">
                <span>Login</span>
                <span className="icon">
                    <FontAwesome6 icon={faArrowRight}/>
                </span>
            </button>
        </div>
    </>)

}

// export class AuthPanel2 extends Component{

//     state = {
//         email: '',
//         password: '',
//         isSignup: false
//     }

//     componentDidMount(){

//     }

//     authenticate(){
//         const { email, password } = this.state;

//         const auth = getAuth();
//         createUserWithEmailAndPassword(auth, email, password)
//           .then((userCredential) => {
//             // Signed in 
//             const user = userCredential.user;
//             // ...
//           })
//           .catch((error) => {
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             // ..
//         });
//     }

//     render(){
//         return (
//             <div className={Styles.LoginWindow}>

//             </div>
//         )
//     }

// }

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
        <div className="section">
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
        </div>
    )

}

export default function Authentication({ ...props }){

    return (<>
        <Route index path="/"       element={ <AuthPage mode="login"/>  }/>
        <Route index path="/login"  element={ <AuthPage mode="login"/>  }/>
        <Route index path="/signup" element={ <AuthPage mode="signup"/> }/>
        <Route index path="/forgot" element={ <AuthPage mode="forgot"/> }/>
        <Route index path="/logout" element={ <Logout /> }/>
    </>)

}