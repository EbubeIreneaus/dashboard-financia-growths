<template>
  <div v-if="data" class="w-full max-w-xl">
    <div
      class="card w-full bg-gradient-to-r from-black to-slate-950 shadow-lg rounded-lg p-6"
    >
      <h2 class="text-xl font-bold text-gray-700 mb-4">Personal Details</h2>

      <div class="space-y-4">
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">ID:</span>
          <span class="font-semibold">{{ data.id }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">Fullname:</span>
          <span class="font-semibold">{{ data.fullname }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">Email:</span>
          <span class="font-semibold">{{ data.email }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Email Verified:</span>
          <span class="font-semibold" v-if="data.emailVerified"><q-icon name="check_circle" color="green-13"/></span>
          <span class="font-semibold" v-else><q-icon name="cancel" color="red-13"/></span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">country:</span>
          <span class="font-semibold">{{ data.country }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Phone:</span>
          <span class="font-semibold">{{ data.phone }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">Active:</span>
          <span class="font-semibold" v-if="data.active"><q-icon name="check_circle" color="green-13"/></span>
          <span class="font-semibold" v-else><q-icon name="cancel" color="red-13"/></span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Joined:</span>
          <span class="font-semibold">{{ date.formatDate(data.createdAt, 'MMM DD, YYYY')}}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Admin:</span>
          <span class="font-semibold" v-if="data.admin"><q-icon name="check_circle" color="green-13"/></span>
          <span class="font-semibold" v-else><q-icon name="cancel" color="red-13"/></span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-10 flex justify-end space-x-3">
        <q-btn
          no-caps
          label="Activate"
          class="btn btn-md btn-success"
          v-if="!data.active"
          @click="activate"
          :loading="isActivating"
        ></q-btn>

        <q-btn
          no-caps
          label="Deactivate"
          class="btn btn-md "
          v-else
          @click="deactivat"
          :loading="isDeactivating"
        ></q-btn>

        <q-btn
          no-caps
          label="Remove Admin"
          class="btn btn-md btn-error"
          v-if="data.admin"
          @click="removeAdmin"
          :loading="isUnMakingAdmin"
        ></q-btn>

        <q-btn
          no-caps
          label="Make Admin"
          class="btn btn-md btn-success"
          v-else
          @click="makeAdmin"
          :loading="isMakingAdmin"
        ></q-btn>


        <q-btn no-caps label="Delete" class="btn btn-md btn-error" disabled></q-btn>
      </div>
    </div>

    <br />

    <div
      class="card w-full bg-gradient-to-r from-black to-slate-950 shadow-lg rounded-lg p-6"
    >
      <h2 class="text-xl font-bold text-gray-700 mb-4">Account Details</h2>

      <div class="space-y-4">
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">Balance:</span>
          <span class="font-semibold" v-money="data.account.balance"></span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">Active Investment:</span>
          <span class="font-semibold" v-money="data.account.active_investment"></span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">Total Earning:</span>
          <span class="font-semibold" v-money="data.account.total_earnings"></span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Pending Withrawal:</span>
          <span class="font-semibold" v-money="data.account.pending_withdrawal"></span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Last Depost:</span>
          <span class="font-semibold" v-money="data.account.last_deposit"></span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Referral Commision:</span>
          <span class="font-semibold" v-money="data.account.affliate_commision"></span>
        </div>
      </div>

      <!-- Action Buttons -->
       <q-btn :to="'/admin/user/'+ data.id + '/account_edit'" label="edit" no-caps class="btn btn-primary mt-5" />
    </div>

    <br />

    <AdminTablePendingInvestmentTable :transactions="data.investments ?? []" title="Investments" />
    <br />
    <AdminTablePendingTransactionTable :transactions="data.transactions ?? []" title="Transactions" />
    <br />
    <AdminTableTotalUserTable :users="data.referrals"/>

  </div>

  <div v-else>
    <div class="card bg-slate-950 text-white w-full">
      <div class="card-body text-center">
        <h2>No user found</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NotifyError, NotifyToastSuccess } from "~/lib/notify";
import type { User } from "~/types/user";
import {date} from 'quasar'

definePageMeta({
  layout: "admin",
  middleware: ["admin-auths"],
});

const isActivating = ref(false)
const isDeactivating = ref(false)
const isMakingAdmin = ref(false)
const isUnMakingAdmin = ref(false)
const isDeleting = ref(false)

const route = useRoute();
const { data } = await useFetch<User>("/api/admin/user/" + route.params.id, {
  headers: {
    Authorization: `Bearer ${useCookie("Authorization").value}`,
  },
});

async function activate() {
  try {
    isActivating.value = true;
    const res = await $fetch<any>(
      "/api/admin/user/" + data.value?.id + "/activate",
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${useCookie("Authorization").value}`,
        },
      }
    );

    if (res.statusCode === 200) {
      data.value = res.data;
      return NotifyToastSuccess("User Activated");
    }
  } catch (error: any) {
    return NotifyError(error.statusMessage);
  } finally {
    isActivating.value = false;
  }
}

async function deactivat() {
  try {
    isDeactivating.value = true;
    const res = await $fetch<any>(
      "/api/admin/user/" + data.value?.id + "/deactivate",
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${useCookie("Authorization").value}`,
        },
      }
    );

    if (res.statusCode === 200) {
      data.value = res.data;
      return NotifyToastSuccess("User Deactivated");
    }
  } catch (error: any) {
    return NotifyError(error.statusMessage);
  } finally {
    isDeactivating.value = false;
  }
}

async function makeAdmin() {
  try {
    isMakingAdmin.value = true;
    const res = await $fetch<any>(
      "/api/admin/user/" + data.value?.id + "/makeAdmin",
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${useCookie("Authorization").value}`,
        },
      }
    );

    if (res.statusCode === 200) {
      data.value = res.data;
      return NotifyToastSuccess("Admin Priviledge Added");
    }
  } catch (error: any) {
    return NotifyError(error.statusMessage);
  } finally {
    isMakingAdmin.value = false;
  }
}

async function removeAdmin(){
  try {
    isUnMakingAdmin.value = true;
    const res = await $fetch<any>(
      "/api/admin/user/" + data.value?.id + "/removeAdmin",
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${useCookie("Authorization").value}`,
        },
      }
    );

    if (res.statusCode === 200) {
      data.value = res.data;
      return NotifyToastSuccess("Admin Priviledge Removed");
    }
  } catch (error: any) {
    return NotifyError(error.statusMessage);
  } finally {
    isUnMakingAdmin.value = false;
  }
}

onMounted(() => {
  console.log(route.params)
})
</script>

<style scoped></style>
