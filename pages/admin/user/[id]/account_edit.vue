<template>
    <div class="flex justify-center items-center">
    <div
      class="card max-w-xl w-full bg-gradient-to-r from-slate-300 to-slate-600"
    >
      <div class="card-body">
        <div v-if="account">
          <h2 class="text-xl text-slate-900 font-bold mb-4">
            Accont Information
          </h2>
          <form @submit.prevent="submit" ref="f">
            <div class="mb-4">
                <label class="block mb-1 ">Balance</label>
                <input type="text" v-model="form.balance" class="input w-full bg-primary">
            </div>
            <div class="mb-4">
                <label class="block mb-1 ">Active Investment</label>
                <input type="text" v-model="form.active_investment" class="input w-full bg-primary">
            </div>
            <div class="mb-4">
                <label class="block mb-1 ">Referral Commision</label>
                <input type="text" v-model="form.affliate_commision" class="input w-full bg-primary">
            </div>
            <div class="mb-4">
                <label class="block mb-1 ">Total Earnings</label>
                <input type="text" v-model="form.total_earnings" class="input w-full bg-primary">
            </div>
            <div class="mb-4">
                <label class="block mb-1 ">Pending Withdrawal</label>
                <input type="text" v-model="form.pending_withdrawal" class="input w-full bg-primary">
            </div>
            <div class="mb-4">
                <label class="block mb-1 ">Total Withdrawal</label>
                <input type="text" v-model="form.total_withdrawal" class="input w-full bg-primary">
            </div>
            <div class="mb-4">
                <label class="block mb-1 ">Last Deposit</label>
                <input type="text" v-model="form.last_deposit" class="input w-full bg-primary">
            </div>
            
            <q-btn label="save" class="btn" type="submit" :loading="isLoading" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NotifyError, NotifyToastSuccess } from '~/lib/notify';

definePageMeta({
    layout: 'admin',
    middleware: ['admin-auths']
})

const route = useRoute();
const isLoading = ref(false)

const form = ref()
const { data: account, error } = await useFetch<any>("/api/admin/user/" + route.params.id+ '/account', {
  headers: {
    Authorization: `Bearer ${useCookie("Authorization").value}`,
  },
});

if (account.value) {
    form.value = account.value
}

async function submit(){
    isLoading.value = true
    try {
        const res = await $fetch<any>("/api/admin/user/" + route.params.id+ "/update_account", {
            method: 'POST',
            body: form.value,
            headers: {
                Authorization: `Bearer ${useCookie('Authorization').value}`
            }
        })

        if (res.statusCode == 200) {
            form.value = res.data[0]
            return NotifyToastSuccess('Account updated successful')
        }
    } catch (error: any) {
        return NotifyError(error.statusMessage)
    } finally {
        isLoading.value = false
    }
}

onMounted(()=>{
    console.log("Account ",account.value)
})
</script>

<style scoped>
</style>