import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        active: true,
      },
    });
    return users;
  } catch (error: any) {
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
