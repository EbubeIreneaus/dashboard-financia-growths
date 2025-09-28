import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const {password, confirm, token} = await readBody(event)
    const config = useRuntimeConfig()

    if (password.length < 6 || password !== confirm) {
      return createError({statusCode: 400, statusMessage: 'password mismatch or lenght less than 6 characters'})
    }

    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)
    const user_decode = jwt.verify(token, config.jwt_secret) as {id: string}

    await prisma.user.update({
      data:{
        password: hashPassword
      },
      where: {
        id: Number(user_decode.id)
      }
    })
    return {statusCode: 200}
  } catch (error: any) {
    console.log(error.message)
    return createError({statusCode: 500, statusMessage: 'Server error, please try again later.'})
  }
})
