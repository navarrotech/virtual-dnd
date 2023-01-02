import {
    // useEffect,
    useState
} from 'react'

// import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

import Styles from 'styles/ChooseAvatar.module.sass'

const imageList = [
    'https://i.ibb.co/CMKR9W2/a0.jpg',
    'https://i.ibb.co/Z2grwgq/a1.jpg',
    'https://i.ibb.co/NskzxFh/a2.png',
    'https://i.ibb.co/gMXkrKh/a3.png',
    'https://i.ibb.co/cDXY79Q/a4.png',
    'https://i.ibb.co/pjxnFJw/a5.png',
    'https://i.ibb.co/vcwRTrm/a6.png',
    'https://i.ibb.co/SvN1Qdd/a7.png',
    'https://i.ibb.co/LP2YW7r/a8.png',
    'https://i.ibb.co/q7Y5V4D/a9.png',
    'https://i.ibb.co/J7NJ62Y/a10.png',
    'https://i.ibb.co/dWcPhSn/a11.png',
    'https://i.ibb.co/ZYtLSZD/a12.png',
    'https://i.ibb.co/pLcHV6Z/a13.png',
    'https://i.ibb.co/vkT7zSG/a14.png',
    'https://i.ibb.co/VTL9SDH/a15.png',
    'https://i.ibb.co/XbVxnLx/a16.png',
    'https://i.ibb.co/y5qvRDs/a17.png',
    'https://i.ibb.co/zN3kmH3/a18.png',
    'https://i.ibb.co/NK0dBjf/a19.png',
    'https://i.ibb.co/M9h2QjC/a20.png',
    'https://i.ibb.co/GRMCFDf/a21.png',
    'https://i.ibb.co/HqZ1Jgc/a22.png',
    'https://i.ibb.co/vqNnP0f/a23.png',
    'https://i.ibb.co/F77B6zh/a24.png',
    'https://i.ibb.co/PwCjLN3/a25.png',
    'https://i.ibb.co/jvS7HWQ/a26.png',
    'https://i.ibb.co/LpYnbrJ/a27.png',
    'https://i.ibb.co/FDJ51BP/a28.png',
    'https://i.ibb.co/KDtKN4Z/a30.png',
    'https://i.ibb.co/jDcncgT/a31.png',
    'https://i.ibb.co/s1dDzYB/a32.png',
    'https://i.ibb.co/QpxhdVM/a33.png',
    'https://i.ibb.co/sbV6WsM/a34.png',
    'https://i.ibb.co/HxkdfSs/a35.png',
    'https://i.ibb.co/nL015n7/a36.png',
    'https://i.ibb.co/2Sh1tHh/a37.png',
    'https://i.ibb.co/qCvZCrT/a38.png',
    'https://i.ibb.co/dcYPjJL/a39.png',
    'https://i.ibb.co/P4nQnhw/a40.png',
    'https://i.ibb.co/ZgHFXS9/a41.png',
    'https://i.ibb.co/j8GtSfg/a42.png',
    'https://i.ibb.co/N7ySK8F/a43.png',
    'https://i.ibb.co/520sF3j/a44.png',
    'https://i.ibb.co/WKDZ6xn/a45.png',
    'https://i.ibb.co/BC4QMWn/a46.png',
    'https://i.ibb.co/djyx930/a47.png',
    'https://i.ibb.co/r0jcRv7/a48.png',
    'https://i.ibb.co/G50nc3Z/a49.png',
    'https://i.ibb.co/TRJqrJc/a50.png',
    'https://i.ibb.co/1M0fk2T/b1.png',
    'https://i.ibb.co/G7DL68T/b2.png',
    'https://i.ibb.co/F5XjFmg/b3.png',
    'https://i.ibb.co/yPm8sbW/b4.png',
    'https://i.ibb.co/TR8KsYM/b5.png',
    'https://i.ibb.co/nRcB5CC/b6.png',
    'https://i.ibb.co/0p7pCn3/b7.png',
    'https://i.ibb.co/02MrTQQ/b8.png',
    'https://i.ibb.co/Mkk9WCt/b9.png',
    'https://i.ibb.co/6DVVbVr/b10.png',
    'https://i.ibb.co/DkhSTLm/b11.png',
    'https://i.ibb.co/TBvwHVk/b12.png',
    'https://i.ibb.co/C0YtrQb/b13.png',
    'https://i.ibb.co/vBsVgC8/b14.png',
    'https://i.ibb.co/hRckpW6/b15.png',
    'https://i.ibb.co/NZd0J1J/b16.png',
    'https://i.ibb.co/9bH51KT/b17.png',
    'https://i.ibb.co/Wk3qwtZ/b18.png',
    'https://i.ibb.co/xYpjhhP/b19.png',
    'https://i.ibb.co/n6wXxK6/b20.png',
    'https://i.ibb.co/wJwM26L/b21.png',
    'https://i.ibb.co/jhpZYdG/b22.png',
    'https://i.ibb.co/kqpv6Dw/b23.png',
    'https://i.ibb.co/6WtSHbS/b24.png',
    'https://i.ibb.co/8Dxrfcr/b25.png',
    'https://i.ibb.co/YQHQ3PV/b26.png',
    'https://i.ibb.co/PWKV1mB/b27.png',
    'https://i.ibb.co/sVJMr2d/b28.png',
    'https://i.ibb.co/rsdzg3L/b29.png',
    'https://i.ibb.co/NTBYFR3/b30.png',
    'https://i.ibb.co/GvGCxgm/b31.png',
    'https://i.ibb.co/pXyZ93V/b32.png',
    'https://i.ibb.co/Nr4ctZ0/b33.png',
    'https://i.ibb.co/93VGT4R/b34.png',
    'https://i.ibb.co/xXjsvPd/b35.png',
    'https://i.ibb.co/JtcT2n4/b36.png',
    'https://i.ibb.co/NYWdhZx/b37.png',
    'https://i.ibb.co/RTdgjqc/b38.png',
    'https://i.ibb.co/br1KRZ2/b39.png',
    'https://i.ibb.co/qykYQGS/b40.png',
    'https://i.ibb.co/mGv0Gxr/b41.png',
    'https://i.ibb.co/1JxNtRt/b42.png',
    'https://i.ibb.co/h9hhX7x/b43.png',
    'https://i.ibb.co/Y0yspbf/b44.png',
    'https://i.ibb.co/kHmmmdP/b45.png',
    'https://i.ibb.co/1ZyTN2B/b46.png',
    'https://i.ibb.co/Wsc5tZ9/b47.png',
    'https://i.ibb.co/Xs4fKYj/b48.png',
    'https://i.ibb.co/z2tZK9R/b49.png',
    'https://i.ibb.co/hmJms6w/b50.png',
    'https://i.ibb.co/rHm8WpN/b51.png',
    'https://i.ibb.co/2W4R3fB/b52.png',
    'https://i.ibb.co/9Nmk35F/b53.png',
    'https://i.ibb.co/Dr0xffM/b54.png',
    'https://i.ibb.co/2sFddb3/b55.png',
    'https://i.ibb.co/gZ4S5th/b56.png',
    'https://i.ibb.co/cwPSKwB/b57.png',
    'https://i.ibb.co/yRLSnmP/b58.png',
    'https://i.ibb.co/k9VsfRm/b59.png',
    'https://i.ibb.co/GMT8cmJ/b60.png',
    'https://i.ibb.co/jr0rQLT/b61.png',
    'https://i.ibb.co/jrKk2Jp/b62.png',
    'https://i.ibb.co/N63cvbs/b63.png',
    'https://i.ibb.co/6RGpkWd/b64.png',
    'https://i.ibb.co/qdBRCS3/b65.png',
    'https://i.ibb.co/tsL3j8j/b66.png',
    'https://i.ibb.co/LS2yfRP/b67.png',
    'https://i.ibb.co/CzhcNTn/b68.png',
    'https://i.ibb.co/FVRcFCQ/b69.png',
    'https://i.ibb.co/M7CFsgT/b70.png',
    'https://i.ibb.co/7gYR730/b71.png',
    'https://i.ibb.co/B63NfDv/b72.png',
    'https://i.ibb.co/4MfX4Np/b73.png',
    'https://i.ibb.co/BjhFn5k/b74.png',
    'https://i.ibb.co/SQ0Y7xx/b75.png',
    'https://i.ibb.co/LN5XBsZ/b76.png',
    'https://i.ibb.co/fxcktQk/b77.png',
    'https://i.ibb.co/3dmrjRv/b78.png',
    'https://i.ibb.co/tKkRvNK/b79.png',
    'https://i.ibb.co/QvFTj37/b80.png',
    'https://i.ibb.co/Rjyh8HX/b81.png',
    'https://i.ibb.co/0KWxMwM/b82.png',
    'https://i.ibb.co/kK6LqLz/b83.png',
    'https://i.ibb.co/3fTh3p1/b84.png',
    'https://i.ibb.co/5kWmWDK/b85.png',
    'https://i.ibb.co/KX0yzyG/b86.png',
    'https://i.ibb.co/sjy6GXJ/b87.png',
    'https://i.ibb.co/HPfGLxZ/b88.png',
    'https://i.ibb.co/vHmSk91/b89.png',
    'https://i.ibb.co/StHp0GP/b90.png',
    'https://i.ibb.co/TwLG6td/b91.png',
    'https://i.ibb.co/JpSt5bw/b92.png',
    'https://i.ibb.co/ySyKNRB/b93.png',
    'https://i.ibb.co/x77YXRL/b94.png',
    'https://i.ibb.co/PZr0Z5q/b95.png',
    'https://i.ibb.co/RghMvNr/b96.png',
    'https://i.ibb.co/4gw21kz/b97.png',
]

export default function ChooseAvatar({ onChoose, current, ...props }){

    // const [imageList, setImageList] = useState([])
    const [selected, setSelected] = useState(current)

    // useEffect(() => {
    //     let reference = ref(getStorage(), 'avatars')
    //     listAll(reference)
    //         .then(({ items }) => {
                
    //             let promises = []
    //             items.forEach(imageRef => {
    //                 promises.push(getDownloadURL(imageRef))
    //             })

    //             return Promise.all(promises);
    //         })
    //         .catch(console.log)
    //         .then((urls) => {
    //             if(!urls){ return }
    //             setImageList(urls)
    //         })
    // }, [])

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
                            imageList.map((url) => <figure key={url} onClick={() => { setSelected(url); }}
                                className={"image " + (url === selected ? Styles['is-selected'] : '')}>
                                <img src={url} alt=""/>
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