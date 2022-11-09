import { useState, useEffect, useContext } from "react"
import { Navigate, Route, Link } from "react-router-dom"

// Icons + Images
import { FontAwesomeIcon as FontAwesome6 } from "@fortawesome/react-fontawesome"
import { faArrowRight, faEnvelope, faLock, faPlus } from "@fortawesome/free-solid-svg-icons"
import Logo from "../images/logo.svg"

// Components
import Loader from "../common/Loader"

// API
import { login, logout, signup } from "../api.js"

// Context
import UserContext from "../context/User.jsx"

export function AuthPanel({ ...props }) {
    const [state, setState] = useState({
        redirect: false,
        mode: props.mode ? props.mode : "login",
        error: "",
        name: "",
        email: "",
        password: "",
        NativeButtonLoading: false,
    })

    const [user, setUser] = useContext(UserContext)

    function NativeSignin() {
        const { name, email, password } = state

        setState({ ...state, NativeButtonLoading: true })

        if (state.mode === "login") {
            login(email, password)
                .catch((e) => {
                    setState({ ...state, NativeButtonLoading: false })
                    Promise.reject(e)
                })
                .then(({ data }) => {
                    if (data && data.id) {
                        setUser(data)
                        return setState({ ...state, NativeButtonLoading: false, redirect: true })
                    }
                    return setState({ ...state, NativeButtonLoading: false, error: "Invalid email or password, please try again!" })
                })
        } else if (state.mode === "signup") {
            signup({ email, password, name })
                .catch((e) => {
                    setState({ ...state, NativeButtonLoading: false })
                    Promise.reject(e)
                })
                .then(({ data }) => {
                    if (data && data.id) {
                        setUser(data)
                        return setState({ ...state, NativeButtonLoading: false, redirect: true })
                    }
                    return setState({ ...state, NativeButtonLoading: false })
                })
        }
    }

    if (state.redirect || (user && user.email)) {
        return <Navigate to="/dashboard" />
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
                                setState({ ...state, mode: "signup", error: "" })
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
                                setState({ ...state, mode: "login", error: "" })
                            }}
                        >
                            login now
                        </span>
                    </h2>
                )}
            </div>
            <div className="block">
                {state.mode === "signup" ? (
                    <div className="field">
                        <div className="control has-icons-left">
                            <input
                                autoFocus={state.mode === "signup"}
                                className="input"
                                type="text"
                                placeholder="Full Name"
                                // autoComplete="email"
                                value={state.name}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        NativeSignin()
                                    }
                                }}
                                onChange={(e) => {
                                    setState({ ...state, name: e.target.value })
                                }}
                            />
                            <span className="icon is-left">
                                <FontAwesome6 icon={faEnvelope} />
                            </span>
                        </div>
                    </div>
                ) : (
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
                            <FontAwesome6 icon={faEnvelope} />
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
                            <FontAwesome6 icon={faLock} />
                        </span>
                    </div>
                </div>
                {state.mode === "login" ? (
                    <div className="field level also-mobile">
                        <p className="is-size-6">&nbsp;</p>
                        <Link to="/forgot" className="is-size-6 has-text-primary">
                            Forgot Password?
                        </Link>
                    </div>
                ) : (
                    <></>
                )}
            </div>
            {state.error ? <div className="block notification is-danger">{state.error}</div> : <></>}
            <div className="block buttons is-centered">
                <button onClick={() => NativeSignin()} disabled={state.email && state.email.includes("@") && state.password.length < 8 && (state.mode === "signup" ? !!state.name : true)} className={"button is-primary is-fullwidth" + (state.NativeButtonLoading ? " is-loading" : "")} type="button">
                    {state.mode === "login" ? (
                        <>
                            <span>Login</span>
                            <span className="icon">
                                <FontAwesome6 icon={faArrowRight} />
                            </span>
                        </>
                    ) : (
                        <>
                            <span>Sign Up</span>
                            <span className="icon">
                                <FontAwesome6 icon={faPlus} />
                            </span>
                        </>
                    )}
                </button>
            </div>
        </>
    )
}

export function Logout({ ...props }) {
    const [done, setDone] = useState(false)
    const [, setUser] = useContext(UserContext)

    useEffect(() => {
        logout()
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setUser(false)
                setDone(true)
            })
    }, [])

    if (done) {
        return <Navigate to="/" />
    }

    return <Loader fullpage={true} />
}

export function AuthPage({ mode, ...props }) {
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

// export function Forgot({ ...props }) {
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
//                                         <FontAwesome6 icon={faEnvelope} />
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

export default (
    <>
        <Route index path="/" element={<AuthPage mode="login" />} />
        <Route index path="/login" element={<AuthPage mode="login" />} />
        <Route index path="/signup" element={<AuthPage mode="signup" />} />
        {/* <Route index path="/forgot" element={<AuthPage mode="forgot" />} /> */}
        <Route index path="/logout" element={<Logout />} />
    </>
)
