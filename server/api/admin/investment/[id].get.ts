import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id") as string;
    const investment = await prisma.investment.findUnique({
      where: {
        investmentId: parseInt(id),
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

    return investment;
  } catch (error: any) {
    console.log(error)
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
