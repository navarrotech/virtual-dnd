import moment from "moment"

import Styles from '../_.module.sass'

export default function LiveChat({ chat, me }){

    return (
        <div className={Styles.LiveChat}>
            <div className={Styles.history}>
                {chat.map(({ what, who, when }) => {
                    return (
                        <p className={[Styles.message, me === who ? Styles.isMe : ""].join(" ")} data-tooltip={moment(when).format("MMM Do [at] HH:MM:SS")}>
                            {what} - <strong>{who}</strong>
                        </p>
                    )
                })}
            </div>
            <div className={Styles.actions}>
                <div className="field">
                    <div className="control">
                        <textarea className="textarea is-ghost" placeholder=""/>
                    </div>
                </div>
            </div>
        </div>
    )

}