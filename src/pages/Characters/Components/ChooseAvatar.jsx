import { useEffect, useState } from 'react'

import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

import Loader from 'common/Loader';

import Styles from '../_.module.sass'

export default function ChooseAvatar({ onChoose, current, ...props }){

    const [imageList, setImageList] = useState([])
    const [selected, setSelected] = useState(current)

    useEffect(() => {
        let reference = ref(getStorage(), 'avatars')
        listAll(reference)
            .then(({ items }) => {
                
                let promises = []
                items.forEach(imageRef => {
                    promises.push(getDownloadURL(imageRef))
                })

                return Promise.all(promises);
            })
            .catch(console.log)
            .then((urls) => {
                if(!urls){ return }
                setImageList(urls)
            })
    }, [])

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
                            imageList.length
                                ? imageList.map((url) => {
                                    return <figure
                                        key={url}
                                        onClick={() => { setSelected(url); }}
                                        className={"image " + (url === selected ? Styles['is-selected'] : '')}
                                    >
                                        <img src={url} alt=""/>
                                    </figure>
                                })
                                : <Loader />
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