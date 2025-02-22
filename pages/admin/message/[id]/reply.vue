<template>
  <div class="min-h-dvh" v-if="data">
    <div
      class="card max-w-xl w-full mx-auto bg-gradient-to-r from-slate-300 to-slate-600"
    >
      <div class="card-body">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Reply This Message</h2>
        </div>
        <form @submit.prevent="submit">
          <input
            :value="'RE:' + data.subject"
            class="input input-md w-full bg-primary mb-3"
            readonly
          />
          <input
            :value="'Email: ' + data.user.email"
            class="input input-md w-full bg-primary mb-3"
            readonly
          />
          <div class="mb-3">
            <label class="ps-2 block text-lg text-slate-900">message</label>
            <textarea
              class="textarea w-full bg-primary text-slate-100"
              rows="5"
              v-model="R.reply"
              required
            ></textarea>
          </div>
          <q-btn no-caps label="send" class="btn px-10" type="submit" :loading="isLoading" />
        </form>
      </div>
    </div>
  </div>

  <div v-else>
    <div class="card bg-slate-950 text-white w-full">
      <div class="card-body text-center">
        <h2>No tranasaction found</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NotifyError, NotifyToastSuccess } from "~/lib/notify";
definePageMeta({
  layout: "admin",
  middleware: ["admin-auths"],
});
const route = useRoute();
const isLoading = ref(false)

const { data, error } = await useFetch<any>(
  "/api/admin/message/" + route.params.id,
  {
    headers: {
      Authorization: `Bearer ${useCookie("Authorization").value}`,
    },
  }
);

const R = reactive({
  reply: "REPLYING TO: "+ data.value.subject.toUpperCase() + '\n',
});

async function submit() {
    isLoading.value = true
  try {
    const res = await $fetch<any>(
      "/api/admin/message/" + route.params.id + "/reply",
      {
        method: "POST",
        body: R,
        headers: {
          Authorization: `Bearer ${useCookie("Authorization").value}`,
        },
      }
    );

    if(res.statusCode == 200){
        NotifyToastSuccess("reply sent")
        return setTimeout(() => {
            useRouter().push('/admin/message')
        }, 3000)
    }
  } catch (error: any) {
    NotifyError(error.statusMessage)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
