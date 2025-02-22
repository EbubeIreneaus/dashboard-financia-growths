import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id") as string;
    console.log("id",id)
    const account = await prisma.user.findFirst({
      where: {
       OR: [
        {email: id},
        {id: isNaN(parseInt(id)) ? 0 : parseInt(id)}
       ]
      },
      select: {
        account: true
      },
    });

    return {...account?.account};
  } catch (error: any) {
    console.log(error)
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
