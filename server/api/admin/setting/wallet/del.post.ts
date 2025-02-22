import prisma from "~/lib/prisma"

export default defineEventHandler(async event => {
    const name = getQuery(event).name as string
    try {
        const wallets = await prisma.cryptoAddress.delete({
            where: {
                name: name
            },
            select: {
                id: true,
                name: true,
                address: true,
                qrImage: true
            }
        })

        return {statusCode: 200, data: wallets}
    } catch (error: any) {
        return createError({
            statusCode: 500, statusMessage: error.message
        })
    }
})