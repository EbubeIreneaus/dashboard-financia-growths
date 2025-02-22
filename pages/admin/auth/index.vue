<template>
  <div
    class="w-screen h-dvh flex items-center justify-center bg-gradient-to-tr from-slate-500 to-slate-950"
  >
    <div class="card card-bordered max-w-xl w-full">
      <div class="card-body">
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="" class="ps-2 mb-1">Email</label>
            <input
              class="input input-md block w-full"
              label="email"
              v-model="form.email"
            />
          </div>
          <div class="mb-5">
            <label for="" class="ps-2 mb-1">Password</label>
            <input
              type="password"
              class="input input-md block w-full"
              placeholder="Password"
              v-model="form.password"
            />
          </div>

          <q-btn
            type="submit"
            label="submit"
            :loading="isLoading"
            no-caps
            class="btn btn-md px-10"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NotifyError } from "~/lib/notify";

const router = useRouter();
const isLoading = ref(false);

definePageMeta({
  layout: false,
});

const form = reactive({
  email: "",
  password: "",
});

async function login() {
  isLoading.value = true;
  try {
    const res = await $fetch<any>("/api/admin/auth/login", {
      method: "POST",
      body: form,
    });

    if (res.statusCode == 200) {
     return router.push("/admin");
    }

  } catch (error: any) {
    return NotifyError(error.statusMessage ?? error.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped></style>
