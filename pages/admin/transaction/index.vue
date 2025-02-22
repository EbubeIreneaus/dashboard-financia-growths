<template>
    <div class="p-2">
        <div class="max-w-xl w-full mb-7">
            <label class="input flex items-center gap-2">
                <input type="search" placeholder="Enter Transaction Id" v-model="search"  class="grow text-slate-950 placeholder:text-black"/>
                <button><q-icon name="search" size="md" v-ripple @click="redirectSearch"/></button>
            </label>
        </div>

        <AdminTablePendingTransactionTable :transactions="pending"/>
        <br />
        <AdminTablePendingTransactionTable :transactions="active" title="Active Transactions"/>
        <br />
        <AdminTablePendingTransactionTable :transactions="data" title="All Transactions" />
       

    </div>
</template>

<script setup lang="ts">
import { AdminTableTotalUserTable } from '#components'
import { NotifyError } from '~/lib/notify'

definePageMeta({
    layout: 'admin',
    middleware: ['admin-auths']
})
const pending = ref([])
const active = ref([])
const search = ref('')
const router = useRouter()

const {data, error} = await useFetch<any>('/api/admin/transaction', {
    headers: {
        Authorization: `Bearer ${useCookie('Authorization').value}`
    }
})

if (data.value) {
    console.log(data.value)
    pending.value = data.value.filter((iv: any) => iv.status=='pending')
    active.value = data.value.filter((iv: any) =>  iv.status=='active')
}

if (error.value) {
    console.log(error.value)
}

function redirectSearch(){
    try {
        const kw = parseInt(search.value)
        router.push(`/admin/transaction/${kw}`)
    } catch {
        return NotifyError('please enter a valid Id format')
    }
}
</script>

<style scoped>

</style>