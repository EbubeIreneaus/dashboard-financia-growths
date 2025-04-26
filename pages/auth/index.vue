<template>
  <main >
    <div class="bg-primary">
      <div class="tw-py-4 tw-px-5 tw-flex tw-items-center">
        <q-btn
          icon="arrow_back"
          label="Home"
          flat
          color="positive"
          :href="`https://${config.public.appAbsoluteUrl}`"
        />
      </div>
    </div>
    <div
      class="q-py-md-sm q-py-lg q-px-md-xl bg-primary py-20 row items-center"
      style="min-height: 100dvh"
    >
      <div
        class="row q-col-gutter-x-lg q-col-gutter-y-xl items-center text-white q-mx-md-auto q-px-md-xl q-px-lg full-width"
        style="max-width: 1228px"
      >
        <div class="col-md col-12">
          <div class="text-h4 q-mb-md">Login</div>
          <form @submit.prevent="Login">
            <input
              class="input input-md input-bordered !bg-primary w-full mb-3"
              type="email"
              v-model="formLogin.email"
              placeholder="email"
            />

            <input
              class="input input-md input-bordered !bg-primary w-full mb-3"
              type="password"
              v-model="formLogin.password"
              placeholder="password"
            />

            <q-checkbox
              class=""
              label="Remember me"
              v-model="formLogin.rememberme"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
              color="positive"
              keep-color
            ></q-checkbox>
            <q-btn
              rounded
              type="submit"
              class="q-px-xl block q-my-md q-mx-auto"
              color="positive"
              :loading="isLoggingin"
              >submit</q-btn
            >
            <div class="h6">
              <router-link to="/auth/fgetpass"
                >Forgot your password?</router-link
              >
            </div>
          </form>
        </div>

        <div class="col-md col-12">
          <div class="text-h4 q-mb-md">Register</div>
          <q-form @submit.prevent="Register()" class="row q-col-gutter-x-sm">
            <q-input
              outlined
              v-model="firstName"
              label="Firstname"
              class="q-mb-md col-md-6 col-12"
              label-color="positive"
              dark
              filled
              required
            />

            <q-input
              outlined
              v-model="lastName"
              label="Lastname"
              class="q-mb-md col-md-6 col-12"
              label-color="positive"
              dark
              filled
              requred
            />

            <q-input
              outlined
              v-model="formRegister.email"
              type="email"
              label="Email"
              class="q-mb-md col-12"
              label-color="positive"
              dark
              filled
              required
            />
            <q-select
              outlined
              :options="COUNTRIES"
              option-label="name"
              v-model="country"
              type="text"
              label="Country"
              class="q-mb-md col-md-6 col-12"
              label-color="positive"
              dark
              filled
            />

            <q-input
              outlined
              v-model="formRegister.phone"
              :prefix="phonePrefix"
              type="tel"
              label="Phone"
              class="q-mb-md col-md-6 col-12"
              label-color="positive"
              dark
              filled
            />
            <q-input
              outlined
              v-model="formRegister.password"
              type="password"
              label="Password"
              class="q-mb-md col-md-6 col-12"
              label-color="positive"
              dark
              filled
              :rules="[(val: string) => val && val.length > 6 || 'password must be six or more character long']"
            />
            <q-input
              outlined
              v-model="confirm"
              type="password"
              label="Confirm"
              class="q-mb-md col-md-6 col-12"
              label-color="positive"
              dark
              filled
              :rules="[validateConfirmPassword]"
            />
            <div class="q-py-md text-body1 text-weight-medium">
              Your personal data will be used to support your experience
              throughout this website, to manage access to your account, and for
              other purposes described in our privacy policy.
            </div>
            <q-btn
              rounded
              class="q-px-xl block q-mx-auto"
              color="positive"
              type="submit"
              :loading="isRegistering"
              >submit</q-btn
            >
          </q-form>
        </div>
      </div>
      <email-verification-component
        v-if="showEmailVerificationDialog"
        :email="isRegistering ? formRegister.email : formLogin.email"
        label="Account Verification"
      ></email-verification-component>
    </div>
  </main>
</template>

<script setup lang="ts">
import { COUNTRIES } from "~/lib/countries";
import { NotifyError } from "~/lib/notify";
definePageMeta({
  layout: false,
});

// const EmailVerificationComponent = defineAsyncComponent(
//   () => import('components/Auth/EmailVerification.vue')
// );
const config = useRuntimeConfig();
const $q = useQuasar();
const isRegistering = ref(false);
const isLoggingin = ref(false);
const showEmailVerificationDialog = ref(false);
const router = useRouter();
const route = useRoute();
// const isLoggingIn = ref(false)

const firstName = ref("");
const lastName = ref("");
const phonePrefix = ref("");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const country: any = ref(null);
const confirm = ref("");

const refferal = useCookie("refferal").value;

const formRegister = reactive({
  fullname: "",
  email: "",
  country: "",
  phone: "",
  password: "",
  referred_id: refferal ?? null,
});

watch([firstName, lastName], () => {
  return (formRegister.fullname = firstName.value + " " + lastName.value);
});

watch(
  () => country.value,
  (val) => {
    formRegister.country = val?.name;
    for (let index = 0; index < COUNTRIES.length; index++) {
      if (COUNTRIES[index].name == val.name) {
        return (phonePrefix.value = COUNTRIES[index].mobileCode);
      }
    }
  }
);

const formLogin = reactive({
  rememberme: false,
  email: "",
  password: "",
});

function validateConfirmPassword(val: string) {
  if (val != formRegister.password) {
    return "Password Mismatch";
  }
  if (val.length < 6) {
    return "password must be six or more character long";
  }
  return true;
}

async function Register() {
  try {
    isRegistering.value = true;
    const res = await $fetch<any>("/api/auth/register", {
      method: "POST",
      body: formRegister,
    });

    if (res.statusCode === 201) {
      return router.push("/");
    }

    return NotifyError(res.statusMessage??res.message, "top-right");
  } catch (error: any) {
    return NotifyError(error.statusMessage , "top-right");
  } finally {
    isRegistering.value = false;
  }
}

async function Login() {
  try {
    isLoggingin.value = true;
    const res = await $fetch<any>("/api/auth/login", {
      method: "POST",
      body: formLogin,
    });

    if (res.statusCode === 200) {
      return router.push("/");
    }
    NotifyError(res.statusMessage, "top-right");
  } catch (error: any) {
    NotifyError(error.statusMessage, "top-right");
  } finally {
    isLoggingin.value = false;
  }
}
</script>

<style scoped></style>
