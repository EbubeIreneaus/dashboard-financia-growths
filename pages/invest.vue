<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { NotifyError } from "~/lib/notify";
import { plans } from "~/lib/plan";

const isLoading = ref(false);
const router = useRouter();

const investForm = reactive({
  plan: "starter",
  amount: null as any as number,
});

function resetForm() {
  investForm.amount = 0;
  investForm.plan = "starter";
}

async function saveOrder() {
  isLoading.value = true;
  try {
    const res = await $fetch<any>("/api/investment/create", {
      method: "POST",
      body: investForm,
      headers: {
        Authorization: `Bearer ${useCookie("Authorization").value}`,
      },
    });

    if (res.statusCode === 201) {
      return router.push( `/checkout/${res.investmentId}`);
    }

    return NotifyError(res.statusMessage);
  } catch (error: any) {
    return NotifyError(error.statusMessage);
  } finally {
    isLoading.value = false;
  }
}

function validateInput(val: number) {
  if (!val) {
    return "This field is required";
  }

  if (!parseInt(val.toString())) {
    return "please enter a valid number";
  }
  if (val < 50) {
    return "minimum amount is USD50";
  }
  for (const plan of plans) {
    let v = parseInt(val.toString());

    if (plan.min <= v && plan.max >= v && investForm.plan != plan.value) {
      return "Please enter amount that matches your plan";
    }
  }
  return true;
}
</script>
<template>
  <div>
    <div
      class="full-width row justify-center items-center q-pa-md"
      style="min-height: 400px"
    >
      <div style="max-width: 768px">
        <div class="text-h4 text-positive text-weight-bold text-center q-mb-md">
          Invest In Your Feature, Invest Today
        </div>
        <div class="text-body1 text-center q-mb-lg">
          Investing with us 100% secured. Below are the investment plans in our
          platform.
        </div>

        <div class="mb-5">
          <input
            class="input input-bordered input-primary w-full text-slate-50"
            placeholder="Amount(USD)"
            type="number"
            step="50"
            v-model="investForm.amount"
          />
        </div>
        <q-form>
          <ul>
            <li v-for="(plan, index) in plans" :key="index">
              <label>
                <input
                  type="radio"
                  :value="plan.value"
                  v-model="investForm.plan"
                  class="hidden peer"
                />
                <div
                  class="py-5 px-2 my-2 rounded-lg shadow shadow-slate-500 peer-checked:!ring"
                >
                  <div class="flex justify-between">
                    <p class="uppercase">{{ plan.label }}</p>
                    <div class="flex gap-3">
                      <p v-money="plan.min" class="font-mono"></p>
                      -
                      <p v-money="plan.max" class="font-mono"></p>
                    </div>
                  </div>
                  <div class="font-mono text-base">
                    +{{ plan.roi }}% every {{ plan.duration }}
                  </div>
                </div>
              </label>
            </li>
          </ul>
        </q-form>
        <q-btn
          color="positive"
          class="q-mt-md block q-mx-auto"
          @click="saveOrder"
          :loading="isLoading"
          >invest now</q-btn
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
