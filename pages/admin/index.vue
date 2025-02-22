<template>
  <div>
    <div class="grid md:grid-cols-3 gap-5 mb-7">
      <div
        class="card card-bordered bg-gradient-to-r from-slate-600 to-slate-900"
      >
        <div class="card-body">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold">
                {{ data?.registeredUser.length }}
              </h2>
              <div>Total Registered User</div>
            </div>
            <q-icon name="people" size="lg" />
          </div>
        </div>
      </div>

      <div
        class="card card-bordered bg-gradient-to-r from-slate-600 to-slate-900"
      >
        <div class="card-body">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold">
                {{ data?.pendingTrans.length }}
              </h2>
              <div>Pending Transactions</div>
            </div>
            <q-icon name="account_balance" size="lg" />
          </div>
        </div>
      </div>

      <div
        class="card card-bordered bg-gradient-to-r from-slate-600 to-slate-900"
      >
        <div class="card-body">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold">
                {{ data?.pendingInvestment.length }}
              </h2>
              <div>Pending Investment</div>
            </div>
            <q-icon name="savings" size="lg" />
          </div>
        </div>
      </div>
    </div>

    <admin-table-total-user-table :users="data?.registeredUser as []"/>
    <br />
    <admin-table-pending-transaction-table :transactions="data?.pendingTrans as []" />
    <br />
    <admin-table-pending-investment-table :transactions="data?.pendingInvestment as []" />
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/user";
definePageMeta({
  layout: "admin",
  middleware: ["admin-auths"],
});

const { data, error } = await useFetch<{
  registeredUser: User[];
  pendingTrans: any[];
  pendingInvestment: any[];
}>("/api/admin/home", {
    headers: {
        Authorization: `Bearer ${useCookie("Authorization").value}`,
      },
});

if (error.value) {
    console.log(error.value)
}

onMounted(() => {
    console.log(data.value)
})
</script>

<style scoped></style>
