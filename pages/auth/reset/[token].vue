<template>
  <div class="p-10">
    <form class="max-w-md w-full p-3" @submit.prevent="submit">
      <div class="mb-5">
        <label for="">New Password</label>
        <input
          class="input-md border rounded block w-full"
          type="password"
          placeholder="new password"
          required
          v-model="form.password"
        />
      </div>
      <div class="mb-5">
        <label for="">Confirm Password</label>
        <input
          class="input-md border rounded block w-full"
          v-model="form.confirm"
          type="password"
          placeholder="confirm password"
          required
        />
      </div>
      <button class="btn btn-primary text-white" type="submit">
        Save Password
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { NotifyError, NotifySuccess } from "~/lib/notify";
definePageMeta({
  layout: false,
});
const { token } = useRoute().params;
const router = useRouter();
const isLoading = ref(false);
const form = reactive({
  password: "",
  confirm: "",
});

const submit = async () => {
  try {
    isLoading.value = true;
    const res = await $fetch("/api/auth/resetPassword", {
      method: "POST",
      body: { ...form, token },
    });

    if (res.statusCode == 200) {
      NotifySuccess("Password saved successfully.", "top-right");
      router.push("/auth/");
    }
  } catch (error: any) {
    NotifyError(
      error.statusMessage || "server error, try again later.",
      "top-right"
    );
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
