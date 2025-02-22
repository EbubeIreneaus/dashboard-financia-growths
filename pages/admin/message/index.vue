<template>
  <div>
    <div class="max-w-2xl" v-if="data">
      <div
        class="card bg-gradient-to-r from-slate-800 to-slate-950 shadow-lg rounded-lg p-4 mb-5"
        v-for="msg in data" :key="data.id"
      >
        <div class="card-body p-1 md:p-5 text-slate-300">
          <div>
            <div class="flex justify-between items-center mb-2">
              <div>
                <h2 class="text-lg font-semibold line-clamp-1">{{ msg.user.fullname }}</h2>
                <p class="text-sm text-slate-300">{{ msg.user.email }}</p>
              </div>
              <span class="text-sm">{{ date.formatDate(msg.createdAt, 'MMM DD, YYYY')}}</span>
            </div>

            <h3 class="text-lg my-3 font-medium text-slate-200">
              Subject: {{ msg.subject }}
            </h3>
            <p class="mt-2 line-clamp-2 mb-2">
             {{ msg.message }}
            </p>

            <div class="mt-4 flex justify-end space-x-2">
              <nuxt-link :to="`/admin/message/${msg.id}/reply`" class="btn btn-primary btn-sm">Reply</nuxt-link>
            
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
        <div class="card bg-slate-950 text-white w-full">
            <div class="card-body text-center">
                <h2>No unread message</h2>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {date} from 'quasar'
definePageMeta({
    layout: 'admin',
    middleware: ['admin-auths']
})
const { data } = await useFetch<any>("/api/admin/message", {
    headers:{
        Authorization: `Bearer ${useCookie('Authorization').value}`
    }
});

onMounted(()=>{
    console.log(data.value)
})
</script>

<style scoped></style>
