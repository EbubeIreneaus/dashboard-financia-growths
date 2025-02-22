import prisma from "~/lib/prisma"

export default defineEventHandler(async event => {
    try {
        const investments = await prisma.investment.findMany({
            select: {
                investmentId: true,
                amount: true,
                active: true,
                user: {
                    select: {
                        id: true
                    }
                }
            }
        })
        return investments
    } catch (error: any) {
        return createError({statusCode: 500, statusMessage: error.message})
    }
})