import prisma from "~/lib/prisma"

export default defineEventHandler(async event => {
    try {
        const id = getQuery(event).investId as string
        console.log('id', id);
        

        const investment = await prisma.investment.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        const wallets = await prisma.cryptoAddress.findMany()

        return {investment, wallets}
    } catch (error:any) {
        return createError(error.message)
    }
})