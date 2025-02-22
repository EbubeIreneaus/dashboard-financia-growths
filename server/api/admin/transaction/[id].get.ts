import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id") as string;
    const transactions = await prisma.transaction.findUnique({
      where: {
        transactionId: parseInt(id),
      },
      include: {
        user: {
          select: {
            fullname: true,
            id: true,
          },
        },
      },
    });

    console.log(transactions)
    return transactions;
  } catch (error: any) {
    console.log(error)
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
