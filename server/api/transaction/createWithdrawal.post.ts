import { nuxtCtx } from "nuxt/kit";
import z from "zod";
import { sendTransactionMail, sendWithdrawalRequestMail } from "~/lib/mail";
import prisma from "~/lib/prisma";

const schema = z.object({
  amount: z.coerce
    .number({ message: "Please enter a valid amount" })
    .min(1, { message: "amount must be greather than $1" }),
  channel: z
    .string()
    .min(1, { message: "please select a valid withdrawal channel" }),
  wallet: z.string().min(1),
});

async function generateId(): Promise<number> {
  try {
    const id = Math.floor(100000 + Math.random() * 99999999);
    const inv = await prisma.transaction.findUnique({
      where: {
        transactionId: id,
      },
    });

    if (inv) {
      return generateId();
    } else {
      return id;
    }
  } catch (error: any) {
    throw createError({ statusMessage: error.message, message: error.messae });
  }
}

export default defineEventHandler(async (event) => {
  try {
    const { error, data } = await readValidatedBody(event, schema.safeParse);
    if (error) {
      return createError({
        statusCode: 422,
        statusMessage: error.issues[0].message,
      });
    }

    const tid = await generateId();

    const t = await prisma.$transaction(async (ctx) => {
      const user = await prisma.user.findFirst({
        where: {
          id: event.context.user.id,
        },
        include: {
          account: true,
        },
      });

      if (!user || !user.account) {
        return createError({
          statusCode: 500,
          statusMessage: "user or account not found",
        });
      }

      if (Number(user?.account?.balance) < data.amount) {
        return createError({
          statusCode: 400,
          statusMessage: "Insufficient funds",
        });
      }

      const transaction = await ctx.transaction.create({
        data: {
          transactionId: tid,
          amount: data.amount,
          type: "withdrawal",
          channel: data.channel,
          wallet: data.wallet,
          userId: event.context.user.id,
          status: "pending",
        },

        include: {
          user: {
            select: {
              fullname: true,
              email: true,
            },
          },
        },
      });

      await ctx.user.update({
        where: {
          id: event.context.user.id,
        },
        data: {
          account: {
            update: {
              pending_withdrawal:Number(user.account.pending_withdrawal) + data.amount,
              balance: Number(user.account.balance) - data.amount,
            },
          },
        },
      });

      return {...transaction};
    });

    if (!(t instanceof Error) && t.user) {
      try {
        await sendWithdrawalRequestMail(t, t.user.email);
      } catch (error:any) {
      }
    }
    return { statusCode: 201 };
  } catch (error: any) {
    return createError({ statusMessage: error.message });
  }
});
