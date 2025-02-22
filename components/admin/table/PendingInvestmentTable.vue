<template>
  <div>
    <QTable
      :columns="TableColum"
      :rows="transactions"
      class="bg-gradient-to-r from-slate-800 to-slate-950 text-slate-50"
      separator="none"
      flat
      :title="title??'Pending Investments'"
    >
      <template v-slot:body="props">
        <q-tr
          @click="
            () =>
              $router.push('/admin/investment/' + props.row.investmentId)
          "
        >
          <q-td>{{ props.row.investmentId }}</q-td>
          <q-td><div v-money="props.row.amount"></div></q-td>
        </q-tr>
      </template>
    </QTable>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/user";
import type { QTableColumn } from "quasar";

const props = defineProps<{ transactions: any[], title?: string}>();

const TableColum: QTableColumn[] = [
  {
    name: "id",
    label: "ID",
    field: "transactionId",
    sortable: true,
    align: "left",
  },
  {
    name: "amount",
    label: "Amount",
    field: "amount",
    sortable: true,
    align: "left",
  },
];
</script>

<style scoped></style>
