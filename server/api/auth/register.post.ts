import prisma from "~/lib/prisma";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const schema = z.object({
  fullname: z
    .string()
    .min(2, { message: "firstname and lastname cannot be empty" }),
  email: z.string().email({ message: "email address is invalid" }),
  country: z.string().min(2, { message: "Please select a valid country" }),
  phone: z.coerce.string().min(7, { message: "enter a valid phone number" }),
  referred_id: z.coerce.number().int().nullable(),
  password: z
    .string()
    .min(6, { message: "strong password must be six (6) characters or more" }),
});

export default defineEventHandler(async (event) => {
  try {
    const { sendMail } = useNodeMailer();
    const { error, data: body } = await readValidatedBody(
      event,
      schema.safeParse
    );
    if (error) {
      return createError({
        statusCode: 400,
        statusMessage: error.issues[0].message,
        message: error.issues[0].message,
      });
    }
    const config = useRuntimeConfig(event);
    const salt = bcrypt.genSaltSync(10);
    const psw = bcrypt.hashSync(body.password, salt);
    const user = await prisma.user.create({
      data: {
        ...body,
        password: psw,
        referred_id: body.referred_id ?? null,
        account: {
          create: {
            balance: 0.0,
          },
        },
      },
      omit: {
        password: true,
        referred_id: true,
      },
    });

    const token = jwt.sign(user, config.jwt_secret, { expiresIn: "24h" });
    // send verification code
    setCookie(event, "Authorization", token, { secure: true, sameSite: "lax" });

    // send welcome email
    try {
      const welcomeMsg = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background: #4CAF50;
            color: white;
            padding: 15px;
            font-size: 24px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .button {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            font-size: 18px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Welcome to Financial Growths!
        </div>
        <div class="content">
            <p>Hi ${user.fullname},</p>
            <p>Thank you for joining us! We're excited to have you on board.</p>
            <p>Click below to get started:</p>
            <a href="https://dashboard.${config.public.appAbsoluteUrl}" class="button">Get Started</a>
        </div>
        <div class="footer">
            If you have any questions, feel free to <a href="mailto:service@financia-growths.com">contact us</a>.<br>
            &copy; 2024 ${config.public.appAbsoluteUrl}. All rights reserved.
        </div>
    </div>
</body>
</html>`;

      await sendMail({
        subject: `Welcome Onboard`,
        text: welcomeMsg,
        html: welcomeMsg,
        to: [user.email],
        bcc: ["service@financia-growths.com"],
      });
    } catch (error: any) {
      console.log(error.message)
    }

    return { statusCode: 201 };
  } catch (error: any) {
    return createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
