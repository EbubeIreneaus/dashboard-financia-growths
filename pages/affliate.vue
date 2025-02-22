<script lang="ts" setup>
import { useCopy } from '~/composables/clipboard';
import { inject, onMounted, ref } from 'vue';
import type { User } from '~/types/user';

const confg =useRuntimeConfig()
const backend = inject('backend');
const userId = inject('userId');

const account = ref({
  balance: 0,
  affliate_commision: 0,
  user: {
    ref_by: {
      fullname: null
    }
  }
})

const referralLink = ref('')

const {data: info, error} = await useFetch<{statusCode: number, user: User}>('/api/user/info', {
    headers: {
        'Authorization': `Bearer ${useCookie('Authorization').value}`
    }
})

referralLink.value = 'https://dashboard.'+confg.public.appAbsoluteUrl+'/auth?r='+info.value?.user.id

onMounted(() => {
    console.log(info)
})
</script>
<template>
  <div>
    <div class="q-pa-lg">
      <div class="row q-gutter-sm">
        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl" v-if="info?.user.referredBy?.fullname">
          <q-card-section
            class="column justify-center items-center q-gutter-md"
          >
            <div class="text-h5">{{ info?.user.referredBy.fullname }}</div>
            <div>Reffered By</div>
          </q-card-section>
        </q-card>

        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl">
          <q-card-section
            class="column justify-center items-center q-gutter-md"
          >
            <div class="text-h5"><div v-money="info?.user.account.affliate_commision"></div></div>
            <div>Total Commision</div>
          </q-card-section>
        </q-card>

        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl">
          <q-card-section
            class="column justify-center items-center q-gutter-md"
          >
            <div class="text-h5" v-money="info?.user.account.balance"></div>
            <div>Wallet Balance</div>
          </q-card-section>
        </q-card>

        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl">
          <q-card-section
            class="column justify-center items-center q-gutter-md"
          >
            <div class="text-h5">$0.00</div>
            <div>Pending Commision</div>
          </q-card-section>
        </q-card>
      </div>

      <q-banner class="bg-accent text-positive q-my-lg">
        <div>
          Invite your family and friends to join us today and unlock the opportunity to earn up to $5,000 in commission when they invest with us!
        </div>
      </q-banner>

      <div>
        <q-input
          v-model="referralLink"
          readonly
          standout
          dark
          label="My Referral Link"
        >
        <template v-slot:append>
          <q-icon name="content_copy" @click="useCopy(referralLink)"></q-icon>
        </template>
      </q-input>
      </div>
    </div>
  </div>
</template>
