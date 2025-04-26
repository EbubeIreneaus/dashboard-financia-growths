import type { H3Event } from "h3";
import prisma from "../prisma";
import { plans } from "../plan";
import { date } from "quasar";

export const sumAndEvaluateInvestment = defineCachedFunction(
  async (event: H3Event) => {
    const userId = event.context.user.id;

    const action = await prisma.$transaction(async (prisma) => {
      //
      const allInvestments = await prisma.investment.findMany({
        where: {
          AND: [
            { active: true },
            { userId: userId },
            { next_due_date: { lte: new Date() } },
          ],
        },
        include: {
          user: {
            omit: {
              password: true,
            },

            include: {
              account: true,
            },
          },
        },
      });

      for (const iv of allInvestments) {
  
        const plan = plans.find((pl) => pl.value == iv.plan);
        const today = new Date();
        const returns = (Number(plan?.roi) / 100) * Number(iv.amount);
        let next_new_date = date.addToDate(iv.next_due_date || today as Date, {
          hours: plan?.duration,
        });

        do {
          await prisma.investment.update({
            where: {
              id: iv.id,
            },
            data: {
              next_due_date: next_new_date,
              roi: Number(iv.roi) + returns,
              user: {
                update: {
                  account: {
                    update: {
                      balance: Number(iv.user.account?.balance) + returns,
                      total_earnings: Number(iv.user.account?.total_earnings) + returns,
                    },
                  },
                },
              },
            },
          });

          next_new_date = date.addToDate(next_new_date || today as Date, {
            hours: plan?.duration,
          });

        } while ((next_new_date as Date) <= today);
      }

    }, {
      timeout: 15000,
    });

    return true;
  },
  {
 
    maxAge: 60 * 60 * 24, // 1 day
    
  }
);
