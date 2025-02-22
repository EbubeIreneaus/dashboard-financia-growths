import z from 'zod'
import { sendMsgRecievedMail } from '~/lib/mail'
import prisma from '~/lib/prisma'

const schema = z.object({
    subject: z.string().min(1, {message: 'message must have a subject'}),
    message: z.string().min(1, {message: 'message field cannot be empty'}),
})
export default defineEventHandler(async event => {
    try {
        const {error, data} = await readValidatedBody(event, schema.safeParse)
        if (error) {
            return createError({
                statusCode: 500,
                statusMessage: error.issues[0].message
            })
        }

        await prisma.message.create({
            data: {
                ...data,
                userId: event.context.user.id
            }
        })

        await sendMsgRecievedMail(event.context.user)
        return {statusCode: 201}
    } catch (error: any) {
        return createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }
})