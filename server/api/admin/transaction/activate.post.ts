import { sendTransactionMail } from "~/lib/mail";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id = getQuery(event).tid as string;
  try {
    const transaction = await prisma.$transaction(async (ctx) => {
      const tr = await ctx.transaction.findUnique({
        where: {
          transactionId: parseInt(id),
        },
      });

      if (!tr) {
        return createError({
          statusCode: 404,
          statusMessage: "transaction does not exist",
        });
      }

      //   if withdrawal
      if (tr.type == "withdrawal") {
        const withdrawal_transaction = await ctx.transaction.update({
          where: {
            transactionId: parseInt(id),
          },
          data: {
            status: "approved",
          },
          include: {
            user: {
              select: {
                email: true,
                id: true,
                fullname: true,
                account: {
                  select: {
                    balance: true,
                    pending_withdrawal: true,
                    last_withdrawal: true,
                  },
                },
              },
            },
          },
        });

        await ctx.account.update({
          where: {
            userId: withdrawal_transaction.userId,
          },
          data: {
            pending_withdrawal:
              Number(withdrawal_transaction.user.account?.pending_withdrawal) -
              Number(withdrawal_transaction.amount),
            last_withdrawal: Number(withdrawal_transaction.amount),
          },
        });

        return withdrawal_transaction;
      } else {
        const transaction = await prisma.transaction.update({
          where: {
            transactionId: parseInt(id),
          },
          data: {
            status: "approved",
          },
          include: {
            user: true,
          },
        });

        return transaction;
      }
    });
    if (!(transaction instanceof Error) && transaction?.user) {
      try {
        await sendTransactionMail(transaction, transaction.user.email);
      } catch (error) {}
    }
    return { statusCode: 200 };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
