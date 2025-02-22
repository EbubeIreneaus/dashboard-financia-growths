import jwt from "jsonwebtoken";
import { User } from "~/types/user";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const path = event.path

  if (path.startsWith('/api/')) {
    if (path.includes("/auth") && !path.startsWith('/api/admin/auth/user')) {
      return;
    }

    if (!path.includes("/admin")) {
      try {
        const Authorization =  getHeader(event, "Authorization")?.split(' ')[1] as string;
        
        
        const token = jwt.verify(
          Authorization,
          config.jwt_secret
        ) as any as User;
        if (token.active) {
          event.context.user = token;
          return;
        }
  
        return createError({
          statusCode: 400,
          statusMessage: "you are not authorise to perform this action",
          message: "you are not authorise to perform this action",
        });
      } catch (error: any) {
        return createError({
          statusCode: 500,
          statusMessage: error.message,
          message: error.message,
        });
      }
    }

    if (path.startsWith("/api/admin")) {
      try {
        const Authorization =  getHeader(event, "Authorization")?.split(' ')[1] as string;
        
        const token = jwt.verify(
          Authorization,
          config.jwt_secret
        ) as any as User;
        if (token.active && token.admin) {
          event.context.user = token;
          return;
        }
  
        return createError({
          statusCode: 400,
          statusMessage: "you are not authorise to perform this action",
          message: "you are not authorise to perform this action " ,
        });
      } catch (error: any) {
        return createError({
          statusCode: 500,
          statusMessage: error.message,
          message: error.message,
        });
      }
    }

  }
 

  return;
});
