import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id = getQuery(event).tid as string;

  try {
    await prisma.investment.delete({
      where: {
        investmentId: parseInt(id),
      },
    });

    return { statusCode: 200 };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
