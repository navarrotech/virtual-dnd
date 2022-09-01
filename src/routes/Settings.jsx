import { useState, useContext, useRef } from "react";
import { UserContext } from './AuthenticatedWrapper'
import { Route } from "react-router";

import { updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import ReactCrop from 'react-image-crop'
import 'react-image-crop/src/ReactCrop.scss'
import { Image } from 'image-js';

import { FontAwesomeIcon as FontAwesome6 } from '@fortawesome/react-fontawesome'
import { faEnvelope, faHatWizard } from "@fortawesome/free-solid-svg-icons";
import Loader from "../common/Loader";

function Settings({ ...props }){

    const [ user, setUser ] = useContext(UserContext)
    const [ crop, setCrop ] = useState({
        unit: 'px', width: 64, height: 64, x: 25, y: 25
    })
    const [ state, setState ] = useState({
        file: null,
        files: [],
        filePreview: '',
        uploading: false,
        cropModal: false,
        displayName: user.displayName
    });

    const fileInput = useRef();

    function save(update){
        if(!update || !Object.keys(update.length)){ return; }
        updateProfile(user.auth.currentUser, update)
        .catch((error) => console.log(error));
    }

    function upload(){
        const { file } = state;
        const storage = getStorage()
        const filereader = new FileReader()
        const storageRef = ref(storage, `/user/${user.uid}/profile.png`)

        setState({
            ...state,
            cropModal: false,
            file: null,
            filePreview: null,
            uploading: true
        })

        filereader.onload = function () {
            Image
                .load(filereader.result)
                .then(function(image){
                    const x = image.width  * (crop.x/100),
                          y = image.height * (crop.y/100),
                          width  = image.width  * (crop.width /100),
                          height = image.height * (crop.height/100)

                    return image.crop({
                        x, y, width, height
                    }).toBlob()
                })
                .then(image => {
                    setCrop({
                        unit: '%', width: 50, height: 50, x: 25, y: 25
                    })
                    return uploadBytes(storageRef, image)
                })
                .then((snapshot) => {
                    setState({ uploading: false })
                    return getDownloadURL( storageRef )
                })
                .then((photoURL) => {
                    setUser({ ...user, photoURL })
                    return save({ photoURL })
                })
        }
        filereader.readAsArrayBuffer(file);
    }
    
    function startCrop([ file ]){
        if(!file){ return }

        const megabyte = 1048576
        if(file.size > megabyte * 2){ return; }

        let reader = new FileReader();
        reader.onload = function () {
            setState({
                ...state,
                cropModal: true,
                file,
                filePreview: reader.result
            })
        }
        reader.readAsDataURL(file);
    }

    return (
        <div className="hero is-halfheight">
            <div className="hero-body">
                <div className="container is-fluid">
                    <div className="subcontainer is-mini">
                        <div className="block has-text-centered">
                            <h1 className="title">Settings</h1>
                        </div>
                        <div className="block box">

                            <div className="block">
                                <figure className="image is-128x128 is-centered is-rounded is-clickable" onClick={() => {
                                    fileInput && fileInput.current && fileInput.current.click()
                                }}>
                                    { state.uploading
                                        ? <Loader size='128px' />
                                        : <img src={user.photoURL} alt={user.displayName} />
                                    }
                                </figure>
                                <input 
                                    ref={fileInput}
                                    accept="image/png, image/jpeg"
                                    type="file"
                                    onChange={(e) => { setState({ files:e.target.files }); startCrop(e.target.files) }}
                                    value={state.files}
                                    className="is-hidden"
                                />
                                <h1>{ state.uploading }</h1>
                            </div>
                            
                            {/* <div className="field">
                                <label className="label">Username (Public)</label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Username"
                                        value={state.username}
                                        onKeyDown={(e) => { if(e.key === 'Enter'){ e.target.blur() } }}
                                        onChange={(e) => { setState({ ...state, username:e.target.value }) }}
                                        onBlur={() => save({ username:state.username }) }
                                    />
                                    <span className="icon is-left">
                                        <FontAwesome6 icon={faHatWizard}/>
                                    </span>
                                </div>
                            </div> */}

                            <div className="field">
                                <label className="label">Your Full Name (Public)</label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Name"
                                        value={state.displayName}
                                        onKeyDown={(e) => { if(e.key === 'Enter'){ e.target.blur() } }}
                                        onChange={(e) => { setState({ ...state, displayName:e.target.value }) }}
                                        onBlur={() => save({ displayName:state.displayName }) }
                                    />
                                    <span className="icon is-left">
                                        <FontAwesome6 icon={faHatWizard}/>
                                    </span>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Email Address</label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Name"
                                        value={user.email}
                                        disabled={true}
                                    />
                                    <span className="icon is-left">
                                        <FontAwesome6 icon={faEnvelope}/>
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            { state.cropModal
                ?   <div className="modal is-active">
                        <div className="modal-background" onClick={() => { setState({ ...state, cropModal: false }) }}></div>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <p className="modal-card-title">Crop Image</p>
                                <button className="delete" onClick={() => { setState({ ...state, cropModal: false }) }}></button>
                            </header>
                            <section className="modal-card-body">
                                <div className="block mx-auto">
                                    <ReactCrop 
                                        minWidth={64}
                                        aspect={1}
                                        keepSelection={true}
                                        crop={crop}
                                        onChange={(pixels, percent) => setCrop(percent)}
                                    >
                                        <img src={state.filePreview} alt="Thumbnail Preview"/>
                                    </ReactCrop>
                                </div>
                            </section>
                            <footer className="modal-card-foot buttons is-right">
                                <button className="button" type="button" onClick={() => { setState({ ...state, cropModal: false }) }}>
                                    <span>Cancel</span>
                                </button>
                                <button className="button is-primary" type="button" onClick={upload}>
                                    <span>Save</span>
                                </button>
                            </footer>
                        </div>
                    </div>
                : <></>
            }
        </div>
    )

}

export default (<>
    <Route path="/settings" element={ <Settings/> } />
</>)