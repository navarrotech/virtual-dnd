import prisma from '../../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../../types'

import { EventSystem } from '../../../sockets/onChange'
import { tablesWhitelist } from '../contants'

export default async function Route(req: DndRequest, res: Response){
  try{
    // Must be an authorized request
    if(!req.session?.authorized){ 
      return res.sendStatus(401)
    }

    const owner = req.session?.user?.id;
    const { table } = req.params;

    if(!tablesWhitelist.includes(table) || !req.body?.update || !req.body?.id){
      return res.sendStatus(400)
    }

    // TODO: Check if user is authorized to update this data (for chat and campaigns)

    let where: any = {
      id: req.body.id
    }
    if(table === 'dnd_characters' || table === 'dnd_campaigns'){
      where = { ...where, owner }
    }

    // Fields the user is not allowed to modify:
    delete req.body?.update?.id
    delete req.body?.update?.owner
    delete req.body?.update?.created

    // @ts-ignore
    await prisma[table]?.updateMany({
      where,
      data: {
        ...req.body.update,
        updated: new Date()
      }
    })

    // @ts-ignore
    const [ result ] = await prisma[table]?.findMany({
      where,
      take: 1
    })

    if(!result){
      res.status(200).send([])
    }

    EventSystem.emit(result.id, result, 'update', table)

    res.status(200).send(result)

  } catch(e){
      console.log(e)
      if(res.headersSent){
        return;
      }
      res.status(500).send(
        process.env.NODE_ENV === 'development' 
          ? e?.toString() || String(e)
          : 'Internal Server Error'
      )
  }
}
