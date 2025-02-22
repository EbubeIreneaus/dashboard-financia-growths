import prisma from "~/lib/prisma"

export default defineEventHandler(async event => {
    try {
        const address = await prisma.cryptoAddress.findMany()
        return address
    } catch (error: any) {
        return createError({
            statusCode: 400,
            statusMessage: error.message
        })
    }
})