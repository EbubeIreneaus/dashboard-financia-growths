import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id") as string;
    const message = await prisma.message.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            fullname: true,
            email: true,
            id: true,
          },
        },
      },
    });

    return message;
  } catch (error: any) {
    console.log(error)
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
