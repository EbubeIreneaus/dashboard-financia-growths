import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const registeredUser = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        active: true,
      },
    });
    const pendingTrans = await prisma.transaction.findMany({
      where: {
        status: 'pending'
      },
      select: {
        transactionId: true,
        amount: true,
        user: {
          select: {
            id: true
          }
        }
      },
    });

    const pendingInvestment = await prisma.investment.findMany({
      where: {
        active: false
      },
      select: {
        investmentId: true,
        amount: true,
        user:{
          select:{
            id: true
          }
        }
      },
    });

    return {
      registeredUser,
      pendingTrans,
      pendingInvestment,
    };
  } catch (error) {
    console.log(error);
    return createError("an error occured");
  }
});
