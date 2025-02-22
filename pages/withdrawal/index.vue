<script lang="ts" setup>
import { NotifyError, NotifyToastSuccess } from "~/lib/notify";
import type { User } from "~/types/user";
const router = useRouter();
const isLoading = ref(false)

const { data: info, error } = await useFetch<{
  statusCode: number;
  user: User;
}>("/api/user/info", {
  headers: {
    Authorization: `Bearer ${useCookie("Authorization").value}`,
  },
});

if (error.value?.statusCode == 404) {
  router.push("/auth/");
}

const withdrawOptions = ["USDT(TRC20)"];

const withdrawForm = reactive({
  wallet: "",
  channel: withdrawOptions[0],
  amount: null as unknown as number,
});

function resetForm() {
  withdrawForm.wallet = "";
  withdrawForm.channel = withdrawOptions[0];
  withdrawForm.amount = "" as any as number;
}

async function saveOrder() {
  if (withdrawForm.amount < 1 || withdrawForm.wallet == "") {
    alert("please fill in the whthdrawal form");
    return false;
  }

  try {
    isLoading.value = true
    const res = await $fetch<any>("/api/transaction/createWithdrawal", {
      method: "post",
      body: withdrawForm,
      headers: {
        Authorization: `Bearer ${useCookie("Authorization").value}`,
      },
    });
    if (res.statusCode === 201) {
      resetForm();
      return NotifyToastSuccess("withdrawal initiated");
    }
    NotifyError(res.statusMessage);
  } catch (error: any) {
    NotifyError(error.statusMessage);
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="q-pa-lg">
    <q-banner class="bg-accent q-py-md q-px-lg" dark>
      <div>Wallet Balance</div>
      <div class="text-h4 q-my-sm">
        <div v-money="info?.user.account.balance"></div>
      </div>
      <div></div>
    </q-banner>

    <div>
      <fieldset class="q-pa-lg q-my-lg" style="max-width: 768px">
        <legend>Wallet Information</legend>
        <q-form spellcheck="off">
          <q-select
            v-model="withdrawForm.channel"
            :options="withdrawOptions"
            dark
            label="Channel"
            filled
            class="q-mb-md"
          ></q-select>
          <q-input
            v-model="withdrawForm.amount"
            dark
            label="Amount"
            filled
            class="q-mb-md"
            required
          ></q-input>
          <q-input
            v-model="withdrawForm.wallet"
            dark
            label="Wallet Address"
            filled
            class="q-mb-md"
            required
          ></q-input>
          <div class="my-5">
            <div class="alert alert-warning text-slate-800 max-w-4xl">
              <q-icon name="info" size="md" />
              <p>
                Once you click the 'Initiate Withdrawal' button, our team will
                review and confirm your request, this usally takes less than one
                (24) hours, untill then this transaction will remain pending.
                thank you fot trusting us with your investment.
              </p>
            </div>
          </div>
          <q-btn class="block btn btn-md btn-primary" @click="saveOrder()" :loading="isLoading"
            >Initiate Withdraw</q-btn
          >
        </q-form>
      </fieldset>
    </div>
  </div>
</template>
