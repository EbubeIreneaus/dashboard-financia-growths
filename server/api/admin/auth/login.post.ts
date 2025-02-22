import prisma from "~/lib/prisma";
import z from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const { error, data } = await readValidatedBody(event, schema.safeParse);
    if (error) {
      return createError({
        statusCode: 400,
        statusMessage: error.issues[0].message,
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },

    });
    
    if (!user || !user.admin) {
      return createError({ statusCode: 404, statusMessage: "user not found" });
    }

    const isValidPsw = bcrypt.compareSync(data.password, user.password);

    if (!isValidPsw) {
      return createError({ statusCode: 404, statusMessage: "user not found" });
    }
    user.password = ''
    const token = jwt.sign(user, config.jwt_secret);

    setCookie(event, "Authorization", token, { secure: true });
    return { statusCode: 200 };
  } catch (error: any) {
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
