<template>
  <div class="min-h-screen -mt-20 w-full flex justify-center items-center">
    <div class="card bg-gradient-to-r from-slate-950 to-slate-600 max-w-xl w-full">
      <form class="card-body " @submit.prevent="submit">
        <h2 class="mb-3 text-2xl font-semibold">Write us your complain or inquires</h2>
        <div class="mb-2">
            <label for="" class="ms-2 mb-1 block">Subject</label>
            <input v-model="form.subject" required type="text" placeholder="subject" class="input input-md bg-primary w-full"/>
        </div>

        <div class="mb-1">
            <label for="" class="ms-2 mb-1 block">Message</label>
            <textarea class="w-full textarea bg-primary text-slate-50" rows="5" v-model="form.message"></textarea>
        </div>
        <q-btn type="submit" class="btn btn-md btn-primary" label="send message" no-caps :loading="isLoading" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NotifyError, NotifyToastSuccess } from '~/lib/notify';

const isLoading = ref(false)

const form = reactive({
    subject: '',
    message: ''
})

async function submit() {
    try {
        isLoading.value = true
        const res = await $fetch('/api/user/sendMessage', {
            method: 'POST',
            body: form,
            headers: {
                Authorization:  `Bearer ${useCookie('Authorization').value}`
            }
        })

        if (res.statusCode ===201) {
            document.querySelector('form')?.reset()
            return NotifyToastSuccess('Message Recieved')
        }
    } catch (error:any) {
        return NotifyError(error.message)
    }finally {
        isLoading.value = false
    }
}
</script>

<style scoped></style>
