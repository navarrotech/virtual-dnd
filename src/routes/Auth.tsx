import { useState, useEffect } from "react"
import { Navigate, Route, useNavigate } from "react-router-dom"

// Icons + Images
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faEnvelope, faLock, faPlus, faUser } from "@fortawesome/free-solid-svg-icons"

// UI
import Logo from "../images/logo.svg"
import Loader from "../common/Loader"

// Utility
import axios from 'axios'
import PasswordStrengthBar from 'react-password-strength-bar';

// Redux
import { useAppSelector, dispatch } from "../core/redux"
import { logout, setUser } from "../redux/user/reducer"

type Mode = 'login' | 'signup'

export function AuthPanel({ mode }:{ mode: Mode }) {

    const navigate = useNavigate()
    const isAuthorized = useAppSelector(state => state.user.authorized)
    const [state, setState] = useState({
        mode,
        first_name: "",
        last_name: "",
        email: "alex@navarrocity.com",
        password: "Javaman01",
        NativeButtonLoading: false,
        message: ""
    })

    useEffect(() => {
        console.log("User is authorized! Redirecting to /campaigns")
        if(isAuthorized){ 
            navigate(
                '/campaigns',
                { replace: false }
            ) 
        }
    }, [ isAuthorized, navigate ])

    async function NativeSignin() {
        const { email, password, first_name, last_name } = state

        setState({ ...state, NativeButtonLoading: true })

        const result = await axios.post('/auth/' + state.mode, { email, password, first_name, last_name })
        if(result.status === 200){
            dispatch(setUser(result.data))
        } else {
            const message = "Invalid email or password! Please try again."
            setState({ ...state, message })
        }
    }

    let isNextDisabled = true
    if (state.email && state.email.includes("@") && state.password.length >= 8 && (state.mode === 'login' || (state.first_name && state.last_name))) {
        isNextDisabled = false
    }

    return (
        <>
            <div className="block has-text-centered">
                <h1 className="title">{state.mode === "login" ? "Login" : "Sign Up"}</h1>
                {state.mode === "login" ? (
                    <h2 className="subtitle">
                        Or{" "}
                        <span
                            className="has-text-primary is-clickable"
                            onClick={() => {
                                setState({ ...state, mode: "signup" })
                            }}
                        >
                            signup for free
                        </span>
                    </h2>
                ) : (
                    <h2 className="subtitle">
                        Or{" "}
                        <span
                            className="has-text-primary is-clickable"
                            onClick={() => {
                                setState({ ...state, mode: "login" })
                            }}
                        >
                            login now
                        </span>
                    </h2>
                )}
            </div>
            <div className="block">
                {state.mode === "signup" ? (<>
                    <div className="field has-addons">
                        <div className="control has-icons-left">
                            <input
                                autoFocus={state.mode === "signup"}
                                className="input"
                                type="text"
                                placeholder="First Name"
                                // autoComplete="email"
                                value={state.first_name}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        NativeSignin()
                                    }
                                }}
                                onChange={(e) => {
                                    setState({ ...state, first_name: e.target.value })
                                }}
                            />
                            <span className="icon is-left">
                                <FontAwesomeIcon icon={faUser}/>
                            </span>
                        </div>
                        <div className="control has-icons-left">
                            <input
                                autoFocus={state.mode === "signup"}
                                className="input"
                                type="text"
                                placeholder="Last Name"
                                // autoComplete="email"
                                value={state.last_name}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        NativeSignin()
                                    }
                                }}
                                onChange={(e) => {
                                    setState({ ...state, last_name: e.target.value })
                                }}
                            />
                            <span className="icon is-left">
                                <FontAwesomeIcon icon={faUser}/>
                            </span>
                        </div>
                    </div>
                </>) : (
                    <></>
                )}
                <div className="field">
                    <div className="control has-icons-left">
                        <input
                            autoFocus={state.mode === "login"}
                            className="input"
                            type="email"
                            placeholder="Email"
                            // autoComplete="email"
                            value={state.email}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    NativeSignin()
                                }
                            }}
                            onChange={(e) => {
                                setState({ ...state, email: e.target.value })
                            }}
                        />
                        <span className="icon is-left">
                            <FontAwesomeIcon icon={faEnvelope} />
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
                                if (e.key === "Enter") {
                                    NativeSignin()
                                }
                            }}
                            onChange={(e) => {
                                setState({ ...state, password: e.target.value })
                            }}
                        />
                        <span className="icon is-left">
                            <FontAwesomeIcon icon={faLock} />
                        </span>
                    </div>
                </div>
                {state.mode === "signup" ? (
                    <div className="field">
                        <PasswordStrengthBar password={state.password} />
                    </div>
                ) : (
                    <></>
                )}
                <div className="field">
                    { state.message
                        ? <div className="notification is-danger">
                            { state.message }
                        </div>
                        : <></>
                    }
                </div>
                {/* {state.mode === "login" ? (
                    <div className="field level also-mobile">
                        <p className="is-size-6">&nbsp;</p>
                        <Link to="/forgot" className="is-size-6 has-text-primary">
                            Forgot Password?
                        </Link>
                    </div>
                ) : (
                    <></>
                )} */}
            </div>
            <div className="block buttons is-centered">
                <button onClick={() => NativeSignin()} disabled={isNextDisabled} type="button" className={"button is-primary is-fullwidth" + (state.NativeButtonLoading ? " is-loading" : "")}>
                    {state.mode === "login" ? (
                        <>
                            <span>Login</span>
                            <span className="icon">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                        </>
                    ) : (
                        <>
                            <span>Sign Up</span>
                            <span className="icon">
                                <FontAwesomeIcon icon={faPlus} />
                            </span>
                        </>
                    )}
                </button>
            </div>
        </>
    )
}

export function AuthPage({ mode }: { mode: Mode }) {
    return (
        <div className="hero is-halfheight">
            <div className="hero-body">
                <div className="container is-max-fullhd">
                    <div className="subcontainer is-mini">
                        <figure className="block image is-128x128 is-centered">
                            <img src={Logo} alt="Virtual DnD" />
                        </figure>
                        <div className="block box">
                            <AuthPanel mode={mode} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// export function Forgot() {
//     const [state, setState] = useState({
//         email: "",
//         finished: false,
//     })

//     function submit() {
//         const { email } = state
//         const auth = getAuth()

//         if (!email || email.includes("@")) {
//             return
//         }

//         sendPasswordResetEmail(auth, email)
//             .then(() => {
//                 setState({ ...state, finished: true })
//             })
//             .catch((error) => {
//                 console.log({ errorCode: error.code, message: error.message })
//             })
//     }

//     if (state.finished) {
//         return (
//             <div className="hero is-halfheight">
//                 <div className="hero-body">
//                     <div className="container is-max-fullhd">
//                         <div className="subcontainer is-mini">
//                             <figure className="block image is-128x128 is-centered">
//                                 <img src={Logo} alt="Virtual DnD" />
//                             </figure>
//                             <div className="block box">
//                                 <div className="block has-text-centered">
//                                     <h1 className="title">An email has been sent to your account</h1>
//                                 </div>
//                                 <div className="block">
//                                     <p className="is-size-5">Please check your email for instructions to reset your password.</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="hero is-halfheight">
//             <div className="hero-body">
//                 <div className="container is-max-fullhd">
//                     <div className="subcontainer is-mini">
//                         <figure className="block image is-128x128 is-centered">
//                             <img src={Logo} alt="Virtual DnD" />
//                         </figure>
//                         <div className="block box">
//                             <div className="block">
//                                 <h1 className="title">Forgot Password</h1>
//                                 <h2 className="subtitle">Enter your email address to reset your password</h2>
//                             </div>
//                             <div className="block">
//                                 <div className="field">
//                                     <div className="control">
//                                         <input
//                                             autoFocus
//                                             className="input"
//                                             type="email"
//                                             placeholder="Email"
//                                             // autoComplete="email"
//                                             value={state.email}
//                                             onKeyDown={(e) => {
//                                                 if (e.key === "Enter") {
//                                                     submit()
//                                                 }
//                                             }}
//                                             onChange={(e) => {
//                                                 setState({ ...state, email: e.target.value })
//                                             }}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="block buttons is-centered">
//                                 <button className="button is-primary is-fullwidth" disabled={!(state.email && state.email.includes("@"))} onClick={submit} type="button">
//                                     <span>Send Reset Instructions</span>
//                                     <span className="icon">
//                                         <FontAwesomeIcon icon={faEnvelope} />
//                                     </span>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

export function Logout() {
    const [done, setDone] = useState(false)

    useEffect(() => {
        axios
            .post(`/auth/logout`, {})
            .catch(console.log)
            .finally(() => {
                dispatch(logout(null))
                setDone(true)
            })
    }, [])

    if (done) {
        return <Navigate to="/" />
    }

    return <Loader fullpage={true} />
}

export default (
    <>
        <Route index path="/" element={<AuthPage mode="login" />} />
        <Route index path="/login" element={<AuthPage mode="login" />} />
        <Route index path="/signup" element={<AuthPage mode="signup" />} />
        {/* <Route index path="/forgot" element={<AuthPage mode="forgot" />} /> */}
        <Route index path="/logout" element={<Logout />} />
    </>
)
