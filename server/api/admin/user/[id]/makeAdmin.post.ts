import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id") as string;
    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        admin: true,
      },
      include: {
        transactions: true,
        investments: true,
        referrals: true,
        account: true,
      },
      omit: {
        password: true,
      },
    });

    return {statusCode: 200, data: user }
  } catch (error: any) {
    return createError({
        statusCode: 500,
        statusMessage: error.message
    })
  }
});
