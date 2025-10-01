import type { User } from "~/types/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
    
  if (to.path.includes("/auth/")) {
    return;
  }
  const config = useRuntimeConfig();
  const authToken = useCookie("Authorization").value;
  
  if (!authToken) {
    return navigateTo("/admin/auth");
  }
  try{
    const user = await $fetch<User>("/api/admin/auth/user", {
      headers: {
        Authorization: `Bearer ${useCookie('Authorization').value}`
      }
    })
    
    if (user && user.admin) {
      return
    }
    return navigateTo("/admin/auth");
  } catch (error: any) {
    // return createError({ statusCode: 500, message: error.message });
    return navigateTo("/admin/auth");
  }
});
