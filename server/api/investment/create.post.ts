import jwt from "jsonwebtoken";
import z from "zod";
import { plans } from "~/lib/plan";
import { date } from "quasar";
import prisma from "~/lib/prisma";
import { sendInvestmentRequestMail } from "~/lib/mail";

const schema = z.object({
  amount: z.coerce.number().min(1, "Please enter amount to invest"),
  plan: z.string().toLowerCase(),
});

async function generateId(): Promise<number> {
  try {
    const id = Math.floor(100000 + Math.random() * 99999999);
    const inv = await prisma.investment.findUnique({
      where: {
        investmentId: id,
      },
    });

    if (inv) {
      return generateId();
    } else {
      return id;
    }
  } catch (error: any) {
    throw createError({statusMessage: error.message, message: error.messae})
  }
}
export default defineEventHandler(async (event) => {
  try {
    const { error, data } = await readValidatedBody(event, schema.safeParse);

    if (error) {
      return createError({
        statusCode: 400,
        statusMessage: error.issues[0].message,
      });
    }
    const plan = plans.find(p => p.value === data.plan) as any
    console.log(plan)
    if (data.amount < plan?.min || data.amount > plan?.max) {
      return createError({
        statusCode: 400,
        statusMessage: 'please enter an amount that correspond to your plan..'
      })
    }
    const investId = await generateId()
    const Iv = await prisma.investment.create({
      data: {
        userId: event.context.user.id,
        plan: data.plan,
        amount: data.amount,
        investmentId: investId,
        active: false
      },
      include: {
        user: {
          select: {
            fullname: true,
            email: true
          }
        }
      }
    });

    try {
      await sendInvestmentRequestMail(Iv, Iv.user.email)
    } catch (error) {
      
    }

    return { statusCode: 201, investmentId: Iv.id };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
