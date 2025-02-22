<template>
  <div class="flex justify-center items-center">
    <div
      class="card max-w-xl w-full bg-gradient-to-r from-slate-300 to-slate-600"
    >
      <div class="card-body">
        <div>
          <h2 class="text-xl text-slate-900 font-bold mb-4">
            Wallet Information
          </h2>
          <form @submit.prevent="submit" ref="f">
            <div class="mb-4">
              <label class="text-slate-900 ps-2">Name</label>
              <input
                type="text"
                class="input w-full input-md bg-primary"
                placeholder="BTC"
                v-model="form.name"
              />
            </div>
            <div class="mb-4">
              <label class="text-slate-900 ps-2">Wallet Address</label>
              <input
                type="text"
                class="input w-full input-md bg-primary"
                placeholder="1J7mdg5rbQyUHENYdx39WVWK7fsLpEoXZy"
                v-model="form.address"
              />
            </div>
            <div class="mb-4">
              <label class="text-slate-900 ps-2">QR Image Link</label>
              <input
                type="url"
                class="input w-full input-md bg-primary"
                placeholder="https://placehold.co/600x400@2x.png"
                v-model="form.qrImage"
              />
            </div>
            <q-btn label="save" class="btn" type="submit"/>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NotifyError, NotifyToastSuccess } from '~/lib/notify';

definePageMeta({
  layout: "admin",
  middleware: "admin-auths",
});
const isLoading = ref(false)
const form = reactive({
  name: "",
  address: "",
  qrImage: "",
});

const f = ref<any>(null)

async function submit(){
    isLoading.value = true
    try {
        const res = await $fetch("/api/admin/setting/wallet/add", {
            method: 'POST',
            body: form,
            headers: {
                Authorization: `Bearer ${useCookie('Authorization').value}`
            }
        })

        if (res.statusCode == 201) {
            f.value?.reset()
            return NotifyToastSuccess('Wallet Added successful')
        }
    } catch (error: any) {
        return NotifyError(error.statusMessage)
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped></style>
