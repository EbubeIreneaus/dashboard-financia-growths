import z from 'zod'
import prisma from '~/lib/prisma'

const schema = z.object({
    name: z.string().min(1, {message: 'name must contain a value'}).trim(),
    address: z.string().min(1, {message: 'address must contain a value'}).trim(),
    qrImage: z.string().min(1, {message: 'name must contain a value'}),
})
export default defineEventHandler(async event => {
    try {
        const {error, data} = await readValidatedBody(event, schema.safeParse)
        if (error) {
            return createError({
                statusCode: 400,
                statusMessage: error.issues[0].message
            })
        }

        await prisma.cryptoAddress.create({
            data: data
        })

        return {statusCode: 201}
    } catch (error: any) {
        return createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }
})