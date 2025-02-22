import prisma from "~/lib/prisma";
import z from "zod";
import { sendMsgReplyMail } from "~/lib/mail";

const schema = z.object({
  reply: z.coerce.string().min(10, { message: "reply cannot be empty" }),
});

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id") as string;

    const { data, error } = await readValidatedBody(event, schema.safeParse);
    if (error) {
      return createError({
        statusCode: 400,
        statusMessage: error.issues[0].message,
      });
    }
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

    if (!message) {
      return createError({
        statusCode: 400,
        statusMessage: "message not found",
      });
    }

    await sendMsgReplyMail(message, data.reply);

    await prisma.message.update({
        where: {
            id: message.id
        },
        data: {
            status: 1
        }
    })
    return {statusCode: 200}
  } catch (error: any) {
    console.log(error);
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
