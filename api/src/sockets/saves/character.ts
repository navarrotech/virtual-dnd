
import prisma from '../../../../database'

export default async function setCharacterData(campaign_id: string, message: any){
  try {
    let { id: character_id, data } = message || {}

    if(!character_id || !data){
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
        character_data: {
          // @ts-ignore
          ...campaign.character_data,
          [character_id]: data
        }
      }
    })

  } catch(error){
    console.log(error)
  }
}
