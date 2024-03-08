
import prisma from '../../../../database'

import { DebouncedFunc, throttle } from 'lodash'

const throttleCache: Record<string, DebouncedFunc<any>> = {}

export default async function updateEntityData(CAMPAIGN_ID: string, MESSAGE: any){
  try {
    if(!throttleCache[CAMPAIGN_ID]){
      throttleCache[CAMPAIGN_ID] = throttle(async (campaign_id: string, message: any) => {
        let { entityId, x, y } = message || {}

        if(!entityId || !x || !y){
          return;
        }
    
        const campaign = await prisma.dnd_campaigns.findFirst({
          where: { id: campaign_id }
        })
    
        if(!campaign){
          return;
        }
    
        await prisma.dnd_campaigns.update({
          where: { id: campaign_id },
          data: {
            map: {
              // @ts-ignore
              ...campaign.map,
              entities: {
                // @ts-ignore
                ...campaign.map.entities,
                [entityId]: {
                  x, y
                }
              }
            }
          }
        })
      }, 5000)
    }

    throttleCache[CAMPAIGN_ID](CAMPAIGN_ID, MESSAGE)

  } catch(error){
    console.log(error)
  }
}
