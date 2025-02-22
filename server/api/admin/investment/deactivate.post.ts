import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id = getQuery(event).tid as string;

  try {
    const iv = await prisma.investment.update({
      where: {
        investmentId: parseInt(id),
      },
      data: {
        active: false,
      },

      include: {
        user: true,
      },
    });

    return { statusCode: 200, data: iv };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
