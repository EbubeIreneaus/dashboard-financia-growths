<template>
  <div>
    <q-table
      :columns="TableColumn"
      :rows="wallets"
      :rows-per-page-options="[10, 20, 20, 50, Infinity]"
      selection="single"
      v-model:selected="selectedCol"
      :loading="isLoading"
      class="bg-gradient-to-r from-slate-800 to-slate-950 text-slate-50"
    >
      <template v-slot:top>
        <div class="flex justify-between w-full">
          <h2 class="text-xl font-bold">Wallets</h2>
          <div class="flex gap-3">
            <q-btn
              no-caps
              label="new"
              icon="add"
              to="/admin/setting/wallet/add"
              class="btn btn-sm btn-primary"
            />
            <q-btn
              no-caps
              icon="fa fa-trash"
              class="btn btn-sm"
              color="red-10"
              size="sm"
              v-if="selectedCol.length > 0"
              @click="toDelete"
            />
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import type { QTableColumn } from "quasar";
import { NotifyError, NotifyToastSuccess } from "~/lib/notify";
const selectedCol = ref<any[]>([]);

const TableColumn: QTableColumn[] = [
  {
    name: "name",
    field: "name",
    label: "Name",
    align: "left",
  },
  {
    name: "address",
    field: "address",
    label: "Wallet Address",
    align: "left",
  },
  {
    name: "qrImage",
    field: "qrImage",
    label: "Qr Image Link",
    align: "left",
  },
];

const wallets = ref([]);
const $q = useQuasar();
const isLoading = ref(false)

const { data, error } = await useFetch<any>("/api/admin/setting/wallet", {
  headers: {
    Authorization: `Bearer ${useCookie("Authorization").value}`,
  },
});

if (data.value) {
  wallets.value = data.value;
}

function toDelete() {
  $q.dialog({
    title: "Are you sure?",
    ok: "I'm sure",
  }).onOk(() => del());
}

async function del() {
  const walletName = selectedCol.value[0].name;
  if (!walletName) {
    return NotifyError("Please select a wallet");
  }
  isLoading .value = true
  try {
    const res = await $fetch<any>(
      "/api/admin/setting/wallet/del?name=" + walletName,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${useCookie("Authorization").value}`,
        },
      }
    );

    if (res.statusCode === 200) {
      data.value = res.data;
      return NotifyToastSuccess("Deleted Sucessfully");
    }
  } catch (error: any) {
    return NotifyError(error.statusMessage);
  } finally {
    isLoading .value = false
  }
}
</script>

<style scoped></style>
