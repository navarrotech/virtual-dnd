
import prisma from '../../../../database'

export default async function setGameState(campaign_id: string, gamestate: any){
  try {
    if(!gamestate){
      gamestate = {
        mode: 'passive',
        data: {}
      }
    }

    await prisma.dnd_campaigns.update({
      where: { id: campaign_id },
      data: {
        state: gamestate
      }
    })

  } catch(error){
    console.log(error)
  }
}
