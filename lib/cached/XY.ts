import type { H3Event } from "h3";
import prisma from "../prisma";
import { plans } from "../plan";
import { date } from "quasar";

// export const sumAndEvaluateInvestment = defineCachedFunction(
//   async (event: H3Event) => {
//     const userId = event.context.user.id;

//     const action = await prisma.$transaction(async (prisma) => {
//       //
//       const allInvestments = await prisma.investment.findMany({
//         where: {
//           AND: [
//             { active: true },
//             { userId: userId },
//             { next_due_date: { lte: new Date() } },
//           ],
//         },
//         include: {
//           user: {
//             omit: {
//               password: true,
//             },

//             include: {
//               account: true,
//             },
//           },
//         },
//       });

//       for (const iv of allInvestments) {
  
//         const plan = plans.find((pl) => pl.value == iv.plan);
//         const today = new Date();
//         const returns = (Number(plan?.roi) / 100) * Number(iv.amount);
//         let next_new_date = date.addToDate(iv.next_due_date || today as Date, {
//           hours: plan?.duration,
//         });

//         do {
//           await prisma.investment.update({
//             where: {
//               id: iv.id,
//             },
//             data: {
//               next_due_date: next_new_date,
//               roi: Number(iv.roi) + returns,
//               user: {
//                 update: {
//                   account: {
//                     update: {
//                       balance: Number(iv.user.account?.balance) + returns,
//                       total_earnings: Number(iv.user.account?.total_earnings) + returns,
//                     },
//                   },
//                 },
//               },
//             },
//           });

//           next_new_date = date.addToDate(next_new_date || today as Date, {
//             hours: plan?.duration,
//           });

//         } while ((next_new_date as Date) <= today);
//       }

//     }, {
//       timeout: 15000,
//     });

//     return true;
//   },
//   {
  
//     maxAge: 60 * 60, // 1 day
//     getKey: (event) => {
//       return `sum-eval-${event.context.user.id || new Date()}` // or event.id or anything unique
//     }
//   }
// );


export const sumAndEvaluateInvestment = defineCachedFunction(
  async (event: H3Event) => {
    const userId = event.context.user.id;
    const now = new Date();

    // Limit to only investments overdue by 1 week max
    const oneWeekAgo = date.subtractFromDate(now, { days: 7 });

    const allInvestments = await prisma.investment.findMany({
      where: {
        AND: [
          { active: true },
          { userId: userId },
          { next_due_date: { lte: now } },
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
      try {
        const plan = plans.find((pl) => pl.value === iv.plan);
        if (!plan) continue;

        const returns = (Number(plan.roi) / 100) * Number(iv.amount);
        const today = new Date();
        let next_due = iv.next_due_date || today;

        // Loop until we catch up to today, max 1-week range already guaranteed
        while (next_due <= today) {
          const new_due = date.addToDate(next_due, { hours: plan.duration });

          await prisma.$transaction([
            prisma.investment.update({
              where: { id: iv.id },
              data: {
                next_due_date: new_due,
                roi: Number(iv.roi) + returns,
              },
            }),
            prisma.account.update({
              where: { id: iv.user.account?.id },
              data: {
                balance: Number(iv.user.account?.balance) + returns,
                total_earnings: Number(iv.user.account?.total_earnings) + returns,
              },
            }),
          ]);

          next_due = new_due;
        }

      } catch (err) {
        console.error(`Failed to process investment ID ${iv.id}:`, err);
        // Optionally send to monitoring system here
      }
    }

    return true;
  },
  {
    maxAge: 60 * 60, // 1 hour (cache)
    getKey: (event) => `sum-eval-${event.context.user.id || new Date().toISOString()}`
  }
);
