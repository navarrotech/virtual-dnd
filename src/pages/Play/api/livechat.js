import { ref, push, set, onValue } from "firebase/database"

const chat_limit = 100

export default function get_livechat(campaign_id, { user, database }){
    return {
        SendMessage: function(message, current_total_messages=0){
            // Push the chat!
            push(ref(database, `campaigns/${campaign_id}/chat`), {
                who: user.uid,
                name: user.displayName,
                when: new Date().toISOString(),
                what: message
            })

            if(current_total_messages >= (chat_limit-1)){
                onValue(ref(database, `campaigns/${campaign_id}/chat`), (snapshot) => {
                    // Gather the values
                    let value = snapshot.val()
                    let messages = Object
                        .keys(value)
                        .map(a => {
                            return { uid: a, ...value[a] }
                        })
                        .sort((a,b) => {
                            return a.when - b.when
                        })
                        .reverse()
                    // Process the keys "to keep"
                    let keep = messages.splice(0, chat_limit)
                    // Convert it back to a JSON object
                    messages = {}
                    keep.forEach(m => messages[m.uid] = { ...m, uid:null })
                    set(ref(database, `campaigns/${campaign_id}/chat`), messages)
                }, { onlyOnce: true })
            }
        }
    }
}