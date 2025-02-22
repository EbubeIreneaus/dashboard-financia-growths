import z from "zod";
import jwt from "jsonwebtoken";
import prisma from "~/lib/prisma";

const schema = z.object({
  fullname: z.string().min(2, { message: "fullname must contain a value" }),
  country: z.string().min(2, { message: "please select a valid country" }),
  phone: z.string().min(2, { message: "please enter a valid country" }),
});
export default defineEventHandler(async (event) => {
 try {
    const { error, data } = await readValidatedBody(event, schema.safeParse);
    if (error) {
      return createError({ statusCode: 400, statusMessage: error.issues[0].message });
    }
  
    await prisma.user.update({
      data: data,
      where: {
        id: event.context.user.id,
      },
    });
  
    return {statusCode: 200}
 } catch (error: any) {
    return createError({statusCode: 500, statusMessage: error.message});
 }
});
