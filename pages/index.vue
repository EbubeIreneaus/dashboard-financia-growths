<template>
  <div class="">
    <div class="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 mb-10">
      <!-- account balance card -->
      <div class="card bg-primary">
        <div class="card-body">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-h5" v-money="info?.user.account.balance"></div>
              <div>Account Balance</div>
            </div>
            <q-icon
              name="account_balance_wallet"
              size="lg"
              color="secondary"
            ></q-icon>
          </div>
        </div>
      </div>
      <!-- active investment card -->
      <div class="card bg-primary">
        <div class="card-body">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-h5" v-money="info?.user.account.active_investment"></div>
              <div>Active Investment</div>
            </div>
            <q-icon name="savings" size="lg" color="secondary"></q-icon>
          </div>
        </div>
      </div>
      <!-- Total withdrawal card -->
      <div class="card bg-primary">
        <div class="card-body">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-h5" v-money="info?.user.account.total_withdrawal"></div>
              <div>Total Withdrawal</div>
            </div>
            <q-icon name="account_balance" size="lg" color="secondary"></q-icon>
          </div>
        </div>
      </div>
      <!-- total earning card -->
      <div class="card bg-primary">
        <div class="card-body">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-h5" v-money="info?.user.account.total_earnings"></div>
              <div>Total Earning</div>
            </div>
            <q-icon name="attach_money" size="lg" color="secondary"></q-icon>
          </div>
        </div>
      </div>
        <!-- Total withdrawal card -->
        <div class="card bg-primary">
        <div class="card-body">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-h5" v-money="info?.user.account.last_withdrawal"></div>
              <div>Last Withdrawal</div>
            </div>
            <q-icon name="fa fa-coins" size="lg" color="secondary"></q-icon>
          </div>
        </div>
      </div>

      <div class="card bg-primary">
        <div class="card-body">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-h5" v-money="info?.user.account.pending_withdrawal"></div>
              <div>Pending Withdrawal</div>
            </div>
            <q-icon name="money" size="lg" color="secondary"></q-icon>
          </div>
        </div>
      </div>

      <div class="card bg-primary">
        <div class="card-body">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-h5" v-money="info?.user.account.affliate_commision"></div>
              <div>Referral Commision</div>
            </div>
            <q-icon name="fa fa-sack-dollar" size="lg" color="secondary"></q-icon>
          </div>
        </div>
      </div>

    </div>

    <div class=" mb-10">
      <div class="alert p-10 bg-accent text-white">
        <q-icon name="info" size="md" />
        <div>
          <div class="text-white text-body1 mb-3">
            Hello {{ info?.user.fullname }} (Not {{ info?.user.fullname }} ?
            <router-link to="/auth/logout" class="text-white"
              >Log Out</router-link
            >)
          </div>
          <div class=" text-body1 mb-3">
            From your account dashboard you can visit our
            <a :href="`https://${$config.public.appAbsoluteUrl}`" class="text-secondary"
              >Home Page</a
            >, make
            <router-link to="/invest" class="text-secondary"
              >Investment</router-link
            >, manage your
            <router-link to="/account" class="text-secondary"
              >Account</router-link
            >, and initiate
            <router-link to="/withdrawal" class="text-secondary"
              >Withdrawal</router-link
            >.
          </div>
        </div>
      </div>
    </div>

    <!-- Investment table -->
    <q-table
      separator="none"
      :columns="investmentColumn"
      card-class="bg-primary text-white"
      title="Active Orders"
      row-key="id"
      :rows="info?.user.investments ?? []"
      class="bg-accent text-white q-px-md rounded-md mb-10"
    >
      <template v-slot:body="props">
        <tr>
          <td>{{ props.row.investmentId }}</td>
          <td>{{ props.row.plan }}</td>
          <td><div v-money="props.row.amount"></div></td>
          <td v-if="props.row.active"><q-icon color="green-13" name="check_circle" /></td>
          <td v-else><q-icon color="red-13" name="cancel" /></td>
          <td><div v-money="props.row.roi"></div></td>
        </tr>
      </template>
    </q-table>

    <q-table
      separator="none"
      :columns="transactionColumn"
      card-class="bg-primary text-white"
      title="Transactions"
      row-key="id"
      :rows="info?.user.transactions ?? []"
      class="bg-accent text-white q-px-md rounded-md"
    >
      <template v-slot:body="props">
        <tr>
          <td>{{ props.row.transactionId }}</td>
          <td>{{ props.row.type }}</td>
          <td>{{ props.row.channel }}</td>
          <td><div v-money="props.row.amount"></div></td>
          <td v-if="props.row.status === 'success'"><q-icon color="green-13" name="check_circle" /></td>
          <td v-else><q-icon color="red-13" name="error" /></td>
        </tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/user';
import type { QTableColumn } from 'quasar';

const token = useCookie('Authorization').value as string
const router = useRouter()

const {data: info} = await useFetch<{statusCode: number, user: User}>('/api/user/info', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})

if (info.value?.statusCode !== 200) {
    router.push('/auth')
}

const investmentColumn: QTableColumn[] = [
  {
    name: 'id',
    label: 'Id',
    field: 'transactionId',
    required: true,
    align: 'left',
  },
  {
    name: 'plan',
    label: 'Plan',
    field: 'plan',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'amount',
    label: 'Amount(USD)',
    field: 'amount',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'roi',
    label: 'ROI',
    field: 'roi',
    required: true,
    align: 'left',
    sortable: true,
  }
];

const transactionColumn: QTableColumn[] = [
  {
    name: 'id',
    label: 'Id',
    field: 'transactionId',
    required: true,
    align: 'left',
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'channel',
    label: 'Channel',
    field: 'channel',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'amount',
    label: 'Amount(USD)',
    field: 'amount',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    required: true,
    align: 'left',
    sortable: true,
  },
];

</script>

<style scoped></style>
