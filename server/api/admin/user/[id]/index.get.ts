import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id") as string;
    console.log("id",id)
    const user = await prisma.user.findFirst({
      where: {
       OR: [
        {email: id},
        {id: isNaN(parseInt(id)) ? 0 : parseInt(id)}
       ]
      },
      include: {
        transactions: true,
        investments: true,
        referrals: true,
        account: true
      },
      omit: {
        password: true
      }
    });

    return user;
  } catch (error: any) {
    console.log(error)
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
