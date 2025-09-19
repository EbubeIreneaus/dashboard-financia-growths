import z from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "~/lib/prisma";
import { date } from "quasar";

const schema = z.object({
  email: z.string().min(1, { message: "email field cannot be empty" }).email(),
  password: z
    .string()
    .min(6, { message: "password must be than six (6) characters long" }),
  rememberme: z.boolean(),
});


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // const {sendMail} = useNodeMailer()
  try {
    const { error, data } = await readValidatedBody(event, schema.safeParse);
    if (error) {
      return createError({
        statusCode: 400,
        statusMessage: error.issues[0].message,
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      return { statusCode: 404, statusMessage: "user not found" };
    }
    const isValidPsw = bcrypt.compareSync(data.password, user.password);

    if (!isValidPsw) {
      return { statusCode: 404, statusMessage: "user not found" };
    }

    user.password = null as any as string;

    const token = jwt.sign(user, config.jwt_secret, {
      expiresIn: data.rememberme ? "30d" : "24h",
    });
    setCookie(event, "Authorization", token, {
      secure: true,
      expires: data.rememberme
        ? date.addToDate(new Date(), { day: 30 })
        : date.addToDate(new Date(), { hour: 24 }),
    });

    
    return { statusCode: 200 };
  } catch (error: any) {
    return { statusCode: 500, statusMessage: error.message };
  }
});
