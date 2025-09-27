<template>
  <div class="h-dvh flex items-center justify-center">
    <div class="max-w-lg w-full card bg-white mx-auto">
      <div class="card-body">
        <form @submit.prevent="submit()">
          <label for="">Email address</label>
          <input
            v-model="form.email"
            class="input-md w-full border rounded-md block my-2"
            placeholder="Email address"
            type="email"
          />
            <p class="font-serif" v-if="btn_disabled">Password reset have been sent to your email address, if you did not recieve this email, try resending after 60 seconds </p>
          <button
            type="submit"
            class="btn my-2 btn-primary text-white"
            :disabled="btn_disabled"
          >
            {{ text }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NotifyError } from "~/lib/notify";

definePageMeta({
  layout: false,
});
const text = ref("Send Reset Information");
const btn_disabled = ref(false);
const form = {
  email: "",
};
const submit = async () => {
  try {
    text.value = 'please wait...'
    const res = await $fetch("/api/auth/sendResetInfo", {
      method: "POST",
      body: form,
    });
    if (res) {
      (text.value = "Resend"), (btn_disabled.value = true);
    }
  } catch (error: any) {
    NotifyError(error.statusMessage, "bottom");
  } finally {
    setTimeout(() => {
      btn_disabled.value = false;
    }, 60000);
  }
};
</script>

<style scoped></style>
