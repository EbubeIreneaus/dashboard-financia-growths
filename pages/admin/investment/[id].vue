<template>
  <div>
    <div
      class="card w-full max-w-md bg-gradient-to-r from-black to-slate-950 shadow-lg rounded-lg p-6"
      v-if="data"
    >
      <h2 class="text-xl font-bold text-gray-700 mb-4">Transaction Details</h2>

      <div class="space-y-5">
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">Investment ID:</span>
          <span class="font-semibold">{{ data.investmentId }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">Owner:</span>
          <span class="font-semibold">{{ data.user.fullname }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">Plan:</span>
          <span class="font-semibold">{{ data.plan }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Amount:</span>
          <span class="font-semibold" v-money="data.amount"></span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Currency:</span>
          <span class="font-semibold">USD</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Lifecycle:</span>
          <span class="font-semibold">Every {{ plan?.duration }} hours</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">lifecycle Returns:</span>
          <span
            class="font-semibold"
            v-money="((plan?.roi || 0) / 100) * data.amount"
          ></span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Status:</span>
          <q-icon name="check_circle" color="green-13" v-if="data.active" />
          <q-icon name="cancel" color="red-13" v-else />
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Date:</span>
          <span class="font-semibold">{{ date.formatDate(data.createdAt, 'MMM DD, YYYY')}}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Start Date:</span>
          <span class="font-semibold">{{ date.formatDate(data.start_date, 'MMM DD, YYYY') ?? 'nill'}}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-10 flex justify-end space-x-3">
        <q-btn
          no-caps
          label="Approve"
          class="btn  btn-success"
          v-if="!data.active && !data.start_date"
          :loading="isApproving"
          @click="toApprove"
        ></q-btn>

        <q-btn
          no-caps
          label="Activate"
          class="btn btn-success"
          v-else-if="!data.active && data.start_date"
          @click="activate"
          :loading="isActivating"
        ></q-btn>

        <q-btn
          no-caps
          label="Deactivate"
          :loading="isDeactivating"
          class="btn  btn-warning"
          v-else
          @click="deactivate"
        ></q-btn>

        <q-btn no-caps label="Delete" class="btn  btn-error" :loading="isDeleting" @click="toDelete"></q-btn>
      </div>
    </div>

    <div v-else>
      <div class="card bg-slate-950 text-white w-full">
        <div class="card-body text-center">
          <h2>No investment found</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NotifyError, NotifyToastSuccess } from "~/lib/notify";
import { plans } from "~/lib/plan";
import {date} from 'quasar'

definePageMeta({
  layout: "admin",
  middleware: ["admin-auths"],
});

const $q = useQuasar();
const isApproving = ref(false);
const isDeactivating = ref(false)
const isActivating = ref(false)
const isDeleting = ref(false)
const plan = ref()
const route = useRoute();
const { data } = await useFetch<any>(
  "/api/admin/investment/" + route.params.id,
  {
    headers: {
      Authorization: `Bearer ${useCookie("Authorization").value}`,
    },
  }
);
if (data.value) {
  plan.value = plans.find((pl) => pl.value == data.value.plan);
}

function toApprove() {
  $q.dialog({
    title: "Are you sure?",
    ok: "I'm sure",
  }).onOk(() => {
    approve();
  });
}
async function approve() {
  try {
    isApproving.value = true;
    const res = await $fetch<any>(
      "/api/admin/investment/approve?tid=" + data.value.investmentId,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${useCookie("Authorization").value}`,
        },
      }
    );

    if (res.statusCode === 200) {
      data.value = res.data;
      return NotifyToastSuccess("Investment Approved");
    }
  } catch (error: any) {
    return NotifyError(error.statusMessage);
  } finally {
    isApproving.value = false;
  }
}

async function deactivate() {
  try {
    isDeactivating.value = true;
    const res = await $fetch<any>(
      "/api/admin/investment/deactivate?tid=" + data.value.investmentId,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${useCookie("Authorization").value}`,
        },
      }
    );

    if (res.statusCode === 200) {
      data.value = res.data;
      return NotifyToastSuccess("Investment Deactivated");
    }
  } catch (error: any) {
    return NotifyError(error.statusMessage);
  } finally {
    isDeactivating.value = false;
  }
}

async function activate() {
  try {
    isActivating.value = true;
    const res = await $fetch<any>(
      "/api/admin/investment/activate?tid=" + data.value.investmentId,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${useCookie("Authorization").value}`,
        },
      }
    );

    if (res.statusCode === 200) {
      data.value = res.data;
      return NotifyToastSuccess("Investment Activated");
    }
  } catch (error: any) {
    return NotifyError(error.statusMessage);
  } finally {
    isActivating.value = false;
  }
}

function toDelete() {
  $q.dialog({
    title: "Are you sure?",
    ok: "I'm sure",
  }).onOk(() => {
    del();
  });
}
async function del() {
  try {
    isDeleting.value = true;
    const res = await $fetch<any>(
      "/api/admin/investment/delete?tid=" + data.value.investmentId,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${useCookie("Authorization").value}`,
        },
      }
    );

    if (res.statusCode === 200) {
      data.value = null;
      return NotifyToastSuccess("Investment Deleted");
    }
  } catch (error: any) {
    return NotifyError(error.statusMessage);
  } finally {
    isDeleting.value = false;
  }
}
</script>

<style scoped></style>
