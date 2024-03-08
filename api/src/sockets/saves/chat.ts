
import { throttle } from 'lodash'
import prisma from '../../../../database'

const add = throttle(async (campaign_id: string) => {
  try {
    const cached = cache[campaign_id]
    cache[campaign_id] = []
    const existingChat = await prisma.dnd_chat.findFirst({
      where: { campaign_id }
    })
    await prisma.dnd_chat.update({
      where: {
        campaign_id
      },
      data: {
        messages: [
          // @ts-ignore
          ...existingChat?.messages || [],
          ...cached || []
        ]
      }
    })
  } catch(error){
    console.log(error)
  }
}, 5 * 1000)

type Cache = {
  [campaign_id: string]: any[]
}
const cache: Cache = {}
export default async function addToChat(campaign_id: string, message: any){
  if(!campaign_id || !message){
    return
  }

  if(!cache[campaign_id]){
    cache[campaign_id] = []
  }
  cache[campaign_id].push(message)
  add(campaign_id)
}
