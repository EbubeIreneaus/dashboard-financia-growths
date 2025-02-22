import z from "zod";
import prisma from "~/lib/prisma";

const schema = z.object({
  balance: z.coerce.number(),
  affliate_commision: z.coerce.number(),
  total_withdrawal: z.coerce.number(),
  pending_withdrawal: z.coerce.number(),
  active_investment: z.coerce.number(),
  total_earnings: z.coerce.number(),
  last_deposit: z.coerce.number(),
});
export default defineEventHandler(async (event) => {
  try {
    const { error, data } = await readValidatedBody(event, schema.safeParse);
    if (error) {
      return createError({
        statusCode: 400,
        statusMessage: error.issues[0].message,
      });
    }
    const id = getRouterParam(event, "id") as string;
    // continue here
    const account = await prisma.account.updateManyAndReturn({
      where: {
        OR: [
          { user: { email: id } },
          { userId: isNaN(parseInt(id)) ? 0 : parseInt(id) },
        ],
      },
      data: data,
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return { statusCode: 200, data: account };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
