import { useState, useEffect } from 'react'

import axios from 'axios'

import Loader from './Loader'

import Styles from 'sass/ChooseAvatar.module.sass'

type Props = {
    onChoose: (avatar?: string | null) => any,
    current?: string
}

export default function ChooseAvatar({ onChoose, current }: Props){

    const [ selected, setSelected ] = useState(current)
    const urls = useAvatarUrls()

    if(!urls){
        return <Loader />
    }

    return (
        <div className={"modal is-active " + Styles.ChooseAvatar}>
            <div className="modal-background" onClick={() => { onChoose(null) }}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Select An Avatar</p>
                    <button className="delete" onClick={() => { onChoose(null) }}></button>
                </header>
                <section className="modal-card-body">
                    <div className={Styles.ChooseAvatarImages}>
                        {
                            urls.map((url) => <figure key={url} onClick={() => { setSelected(url); }}
                                className={"image " + (url === selected ? Styles['is-selected'] : '')}>
                                <img src={url} alt="" crossOrigin="anonymous"/>
                            </figure>)
                        }
                    </div>
                </section>
                <footer className="modal-card-foot buttons is-right">
                    <button className="button" type="button" onClick={() => { onChoose(null) }}>
                        <span>Cancel</span>
                    </button>
                    <button className="button is-primary" type="button" onClick={() => { onChoose(selected) }}>
                        <span>Save</span>
                    </button>
                </footer>
            </div>
        </div>
    )

}

let cache: any = null
function useAvatarUrls(){
    const [ urls, setUrls ] = useState([])

    useEffect(() => {
        if(cache){
            setUrls(cache)
        }
        axios
            .post(`/avatars`)
            .then(response => {
                if(!response || response.status !== 200){
                    return;
                }
                setUrls(response.data)
                cache = response.data
            })
    }, [])

    return urls;
}
