import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const transactions = await prisma.transaction.findMany({
      select: {
        transactionId: true,
        amount: true,
        type: true,
        status: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    return transactions;
  } catch (error: any) {
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
