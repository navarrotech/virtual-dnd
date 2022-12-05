import { getDatabase } from 'firebase/database'
import get_livechat from './livechat.js'

export default function getAPI(campaign_id, user) {
    const database = getDatabase()
    return {
        livechat: get_livechat(campaign_id, { user, database })
    }
}