import z from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '~/lib/prisma'

const schema = z.object({
    psw: z.string().min(6, {message: 'Password must be more than six (6) character long'})
})
export default defineEventHandler(async event => {
    try {
        const {error, data} = await readValidatedBody(event, schema.safeParse)
        if (error) {
            return createError({statusCode: 400, statusMessage: error.issues[0].message})
        }

        const salt = bcrypt.genSaltSync(10)
        const psw = bcrypt.hashSync(data.psw, salt)

        await prisma.user.update({
            data: {
                password: psw
            },
            where: {
                id: event.context.user.id
            }
        })

        return {statusCode: 200}
        
    } catch (error: any) {
        return createError({statusCode: 500, statusMessage: error.message})
    }
})