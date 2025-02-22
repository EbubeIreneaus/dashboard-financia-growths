<template>
    <div class="p-2">
        <div class="max-w-xl w-full mb-7">
            <label class="input flex items-center gap-2">
                <input type="search" placeholder="Enter Investment Id" v-model="search" class="grow text-slate-950 placeholder:text-black"/>
                <button @click="redirectSearch"><q-icon name="search" size="md" v-ripple /></button>
            </label>
        </div>

        <AdminTablePendingInvestmentTable :transactions="pending"/>
        <br />
        <AdminTablePendingInvestmentTable :transactions="active" title="Active Investment"/>
        <br />
        <AdminTablePendingInvestmentTable :transactions="data" title="All Investment" />

    </div>
</template>

<script setup lang="ts">
import { NotifyError } from "~/lib/notify";

definePageMeta({
    layout: 'admin',
    middleware: ['admin-auths']
})
const pending = ref([])
const active = ref([])
const search = ref('')
const router = useRouter()

const {data, error} = await useFetch<any>('/api/admin/investment', {
    headers: {
        Authorization: `Bearer ${useCookie('Authorization').value}`
    }
})

if (data.value) {
    console.log(data.value)
    pending.value = data.value.filter((iv: any) => !iv.active)
    active.value = data.value.filter((iv: any) => iv.active)
}

if (error.value) {
    console.log(error.value)
}

function redirectSearch(){
    try {
        const kw = parseInt(search.value)
        router.push(`/admin/investment/${kw}`)
    } catch {
        return NotifyError('please enter a valid Id format')
    }
}
</script>

<style scoped>

</style>