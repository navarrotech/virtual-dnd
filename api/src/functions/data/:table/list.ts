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

    const table = req.params.table;

    if(!tablesWhitelist.includes(table)){
      return res.sendStatus(400)
    }

    if(table === 'dnd_users'){
      return res.sendStatus(403);
    }

    if(!req.body.id){
      return res.sendStatus(400) 
    }

    // @ts-ignore
    const result = await prisma[table]?.findMany({
      where: {
        id: req.body.id
      },
      skip: req.body.skip,
      take: req.body.take
    })

    EventSystem.emit(result.id, result, 'list', table)

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
