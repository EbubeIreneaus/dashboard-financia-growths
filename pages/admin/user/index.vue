<template>
    <div class="p-2">
        <div class="max-w-xl w-full mb-7">
            <label class="input flex items-center gap-2">
                <input type="search" placeholder="Enter email address" v-model="search"  class="grow text-slate-950 placeholder:text-black"/>
                <button><q-icon name="search" size="md" v-ripple @click="redirectSearch" /></button>
            </label>
        </div>

        <AdminTableTotalUserTable :users="data" :start="25"/>

    </div>
</template>

<script setup lang="ts">
import { NotifyError } from "~/lib/notify";

definePageMeta({
    layout: 'admin',
    middleware: ['admin-auths']
})

const search = ref('')
const router = useRouter()

const {data, error} = await useFetch<any>('/api/admin/user/all', {
    headers: {
        Authorization: `Bearer ${useCookie('Authorization').value}`
    }
})

if (error.value) {
    console.log(error.value)
}

function redirectSearch(){
    try {
        const kw = search.value
        router.push(`/admin/user/${kw}`)
    } catch {
        return NotifyError('please enter a valid Id format')
    }
}
</script>

<style scoped>

</style>