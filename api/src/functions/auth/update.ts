import prisma from '../../../../database'
import passwordHash from "password-hash";

import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response){
    try {
        // Must be an authorized request
        if(!req.session || !req.session.user){ return res.sendStatus(401) }

        const id = req.session?.user?.id;
        const user = await prisma.dnd_user.findUnique({
            where: {
                id
            }
        })

        if(!user){
            return res.sendStatus(400)
        }

        let { first_name, last_name, password, photoURL } = req.body

        let changes: any = {}

        if(password && password.length >= 8){
            password = passwordHash.generate(password)
            changes.password = password;
            req.session.user.password = password;
        }

        if(first_name){
            changes.first_name = first_name;
            req.session.user.first_name = first_name;
        }

        if(last_name){
            changes.last_name = last_name;
            req.session.user.first_name = first_name;
        }

        if(photoURL){
            changes.photoURL = photoURL;
            req.session.user.photoURL = photoURL;
        }

        await req.session.save()
        await prisma.dnd_user.update({
            where: {
                id
            },
            data: changes
        })

        await new Promise(acc => req.session.save(() => acc(null)))
    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}
