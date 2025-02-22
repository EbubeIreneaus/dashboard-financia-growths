<template>
  <div>
    <div class="card bg-primary">
      <div class="card-body">
        <div class="mb-5">
          <span class="text-blue-700">Starter plan</span>
          <div
            v-money="data?.investment.amount"
            class="text-2xl md:text-4xl font-bold"
          ></div>
        </div>

        <div class="mb-5">
          <label for="payoption" class="ps-2">Payment Method</label>

          <select
            v-model="paymentMethod"
            id="payoption"
            class="select select-md select-bordered border-slate-600 !block w-full uppercase mt-1"
          >
            <option
              :value="op.name"
              v-for="op in wallets"
              :key="op.name"
              class=""
            >
              {{ op.name }}
            </option>
          </select>
        </div>

        <div class="mb-5">
          <nuxt-img
            :src="wallet?.qrImage"
            height="300px"
            width="350px"
            class="max-w-sm w-full min-h-[300px] rounded-lg mb-4 border-0"
            loading="lazy"
            alt="scan QRCode for wallet address"
          />
          <div class="max-w-sm text-subtitle1 line-clamp-1 text-ellipsis">
            {{ wallet?.address }}
          </div>
          <button
            class="btn btn-sm"
            @click="() => useCopy(wallet?.address ?? '')"
          >
            copy
          </button>
        </div>

        <div>
          <h2 class="text-lg md:text-3xl font-bold mb-4">Investment Details</h2>
          <q-list class="max-w-3xl">
            <q-item>
              <q-item-section class="text-subtitle1">Plan</q-item-section>
              <q-item-section class="text-subtitle2 italic">{{
                data?.investment.plan
              }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-subtitle1">Amount</q-item-section>
              <q-item-section class="text-subtitle2"
                ><div v-money="data?.investment.amount"></div
              ></q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-subtitle1">Returns</q-item-section>
              <q-item-section class="text-subtitle2"
                ><div v-money="investment?.amount * (plan.roi / 100)"></div
              ></q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-subtitle1">Lifecycle</q-item-section>
              <q-item-section class="text-subtitle2 italic"
                >every {{ plan.duration }} hours</q-item-section
              >
            </q-item>
            <q-item>
              <q-item-section class="text-subtitle1">Start Date</q-item-section>
              <q-item-section class="text-subtitle2 italic"
                >Nill</q-item-section
              >
            </q-item>
            <q-item>
              <q-item-section class="text-subtitle1"
                >Next Retrun</q-item-section
              >
              <q-item-section class="text-subtitle2 italic"
                >Nill</q-item-section
              >
            </q-item>
            <q-item>
              <q-item-section class="text-subtitle1">Status</q-item-section>
              <q-item-section class="text-subtitle2 italic">{{
                data?.investment.active ? "active" : "pending / pause"
              }}</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="my-5">
          <div class="alert alert-warning text-slate-800 max-w-4xl">
            <q-icon name="info" size="md" />
            <p>
              Once you click the 'I have made my payment' button, our team will
              review and confirm your payment, this usally takes less than one
              (1) hour, untill then this investment will remain pending. thank
              you fot trusting us with your investment.
            </p>
          </div>
        </div>

        <div>
          <button class="btn btn-md" @click="paymentMade()">
            I have made my payment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCopy } from "~/composables/clipboard";
import type { Investment } from "~/types/investment";
import { plans } from "~/lib/plan";
import Swal from "sweetalert2";
const route = useRoute();
const investment = ref<Investment>();

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const wallets = ref<any>([]);

const paymentMethod = ref(null);
const wallet = computed(() => {
  return wallets.value.find((pr: any) => pr.name == paymentMethod.value);
});

const { data, error } = await useFetch<{
  investment: Investment;
  wallets: any;
}>("/api/investment/get?investId=" + route.params.investId, {
  headers: {
    Authorization: `Bearer ${useCookie("Authorization").value}`,
  },
});

if (data.value) {
  investment.value = data.value.investment;
  wallets.value = data.value.wallets;
  paymentMethod.value = wallets.value[0].name;
}

const plan = computed(() => {
  for (const plan of plans) {
    if (plan.value.toLowerCase() == investment.value?.plan.toLowerCase()) {
      return plan;
    }
  }
  return {
    label: "",
    value: "",
    min: 0,
    max: 0,
    roi: 0,
    duration: 24,
  };
});

function paymentMade() {
  Toast.fire({
    icon: "info",
    title: "Payment is Processing",
    padding: "10px",
  });
  setTimeout(() => {
    useRouter().push("/");
  }, 3000);
}

// onMounted(() => {
//   console.log(data.value);
// });
</script>

<style scoped></style>
