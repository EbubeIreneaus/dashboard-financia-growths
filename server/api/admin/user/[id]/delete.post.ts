import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id") as string;
    const user = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    
    });

    return {statusCode: 200 }
  } catch (error: any) {
    return createError({
        statusCode: 500,
        statusMessage: error.message
    })
  }
});
