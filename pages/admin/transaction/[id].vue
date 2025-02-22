<template>
  <div>
    <div
      class="card w-full max-w-md bg-gradient-to-r from-black to-slate-950 shadow-lg rounded-lg p-6"
      v-if="data"
    >
      <h2 class="text-xl font-bold text-gray-700 mb-4">Transaction Details</h2>

      <div class="space-y-5">
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">Transaction ID:</span>
          <span class="font-semibold">{{ data.transactionId }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">Owner:</span>
          <span class="font-semibold">{{ data.user.fullname }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">Type:</span>
          <span class="font-semibold">{{ data.type }}</span>
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
          <span class="text-gray-500">Channel:</span>
          <span class="font-semibold">{{ data.channel ?? "nill" }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Wallet Address:</span>
          <span class="font-semibold">{{ data.wallet ?? "nill" }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Status:</span>
          <span
            class="badge"
            :class="
              data.status == 'approved' ? 'badge-success' : 'badge-warning'
            "
            >{{ data.status }}</span
          >
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Date:</span>
          <span class="font-semibold">{{ date.formatDate(data.createdAt, 'MMM DD, YYYY')}}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Approve Date:</span>
          <span class="font-semibold">{{ date.formatDate(data.approvedAt, 'MMM DD, YYYY')?? 'nill'}}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-10 flex justify-end space-x-3">
        <q-btn
          no-caps
          label="Approve"
          class="btn btn-md btn-success"
          :disable="data.status === 'approved'"
          @click="activate"
        ></q-btn>
        <q-btn
          no-caps
          label="Delete"
          class="btn btn-md btn-error"
          @click="del"
        ></q-btn>
      </div>
    </div>

    <div v-else>
      <div class="card bg-slate-950 text-white w-full">
        <div class="card-body text-center">
          <h2>No tranasaction found</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NotifyError, NotifyToastSuccess } from "~/lib/notify";
import {date} from 'quasar'
const $q = useQuasar();
definePageMeta({
  layout: "admin",
  middleware: ["admin-auths"],
});
const route = useRoute();
const { data } = await useFetch<any>(
  "/api/admin/transaction/" + route.params.id,
  {
    headers: {
      Authorization: `Bearer ${useCookie("Authorization").value}`,
    },
  }
);

async function activate() {
  try {
    const res = await $fetch<any>(
      "/api/admin/transaction/activate?tid=" + data.value.transactionId,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${useCookie("Authorization").value}`,
        },
      }
    );

    if (res.statusCode === 200) {
      data.value.status = "approved";
      return NotifyToastSuccess("Transaction Approved");
    }
  } catch (error: any) {
    return NotifyError(error.statusMessage);
  }
}

async function del() {
  $q.dialog({
    title: "are you sure?",
    ok: "I'm sure",
  }).onOk(async () => {
    try {
      const res = await $fetch<any>(
        "/api/admin/transaction/deleteTr?tid=" + data.value.transactionId,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${useCookie("Authorization").value}`,
          },
        }
      );

      if (res.statusCode === 200) {
        data.value = null;
        return NotifyToastSuccess("Deleted Sucessfully");
      }
    } catch (error: any) {
      return NotifyError(error.statusMessage);
    }
  });
}
</script>

<style scoped></style>
