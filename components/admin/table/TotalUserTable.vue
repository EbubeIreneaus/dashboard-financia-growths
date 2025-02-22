<template>
  <div>
    <QTable
      :columns="TableColum"
      :rows="users"
      class="bg-gradient-to-r from-slate-800 to-slate-950 text-slate-50"
      separator="none"
      flat
      title="Registered Users"
    >
      <template v-slot:body="props">
        <q-tr @click="() => $router.push('/admin/user/' + props.row.id)">
          <q-td>{{ props.row.fullname }}</q-td>
          <q-td v-if="props.row.active"
            ><q-icon name="check_circle" color="green-12"
          /></q-td>
          <q-td v-else><q-icon name="cancel" color="red-12" /></q-td>
        </q-tr>
      </template>
    </QTable>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/user";
import type { QTableColumn } from "quasar";

const props = defineProps<{ users: User[], start?: number }>();

const TableColum: QTableColumn[] = [
  {
    name: "fullname",
    label: "Fullname",
    field: "fullname",
    sortable: true,
    align: "left",
  },
  {
    name: "active",
    label: "Active",
    field: "active",
    sortable: true,
    align: "left",
  },
];
</script>

<style scoped></style>
