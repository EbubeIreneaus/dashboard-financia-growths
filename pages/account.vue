<script setup lang="tsx">
import { useQuasar } from "quasar";
import { COUNTRIES } from "~/lib/countries";
import { NotifyError, NotifyToastSuccess } from "~/lib/notify";
import type { User } from "~/types/user";
const $q = useQuasar();

const nameLoading = ref(false);
const pswLoading = ref(false);

const user = ref<User>(null as any as User);

const { data: info, error } = await useFetch<{
  statusCode: number;
  user: User;
}>("/api/user/info", {
  headers: {
    Authorization: `Bearer ${useCookie("Authorization").value}`,
  },
});

if (error.value) {
  throw createError(error.value?.message);
}

if (info.value?.user) {
  user.value = info.value?.user;
}

let psw = reactive({
  psw: "",
});
const confirm = ref("");

async function updateName() {
  nameLoading.value = true;
  try {
    const res = await $fetch<any>("/api/user/updateData", {
      method: "POST",
      body: user.value,
      headers: {
        Authorization: `Bearer ${useCookie("Authorization").value}`,
      },
    });

    if (res.statusCode == 200) {
        return NotifyToastSuccess('Upadated Sucessfully')
    }
    NotifyError(res.statusMessage)
  } catch (error: any) {
    NotifyError(error.statusMessage, "top-right");
  } finally {
    nameLoading.value = false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resetPassword() {
  if (psw.psw.length < 6 || psw.psw !== confirm.value) {
    return $q.notify({
      message: "please check your password correctly",
      color: "red-14",
      icon: "error",
    });
  }

  pswLoading.value = true;
 
  try {
    const res = await $fetch<any>('/api/user/updatePsw', {
        method: 'POST',
        body: psw,
        headers: {
            "Authorization": `Bearer ${useCookie('Authorization').value}`
        }
    })

    if (res.statusCode == 200) {
        return NotifyToastSuccess('Upadated Sucessfully')
    }
    NotifyError(res.statusMessage)
  } catch (error: any) {
    NotifyError(error.statusMessage, "top-right");
  } finally {
    pswLoading.value = false
  }
}
</script>
<template>
  <div class="full-width full-height row items-center q-py-xl q-px-md">
    <div class="full-width" style="max-width: 768px">
      <form autocorrect="off" spellcheck="false">
        <fieldset class="q-pa-lg q-mb-lg">
          <legend>Personal</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              class="input input-md input-bordered bg-primary md:col-span-2"
              v-model="user.fullname"
              placeholder="Fullname"
            />
            <label
              class="input input-bordered input-primary bg-primary text-white flex items-center gap-2"
            >
              <input
                type="email"
                class="grow input-primary"
                placeholder="Email"
                v-model="user.email"
                readonly
              />
              <q-icon
                name="check_circle"
                color="green-13"
                v-if="user.emailVerified"
              />
              <q-icon name="cancel" color="red-13" />
            </label>
            <input
              class="input input-md input-bordered bg-primary w-full"
              v-model="user.phone"
              placeholder="phone"
            />
            <select
              class="select select-md select-bordered bg-primary"
              v-model="user.country"
            >
              <option
                :value="country.name"
                v-for="country in COUNTRIES"
                class="text-white"
              >
                {{ country.name }}
              </option>
            </select>
          </div>
          <q-btn
            label="update record"
            @click="updateName()"
            class="btn btn-md btn-accent border mt-5"
            :loading="nameLoading"
          />
        </fieldset>

        <fieldset class="q-pa-lg">
          <legend>Password</legend>
          <input
            class="input input-md input-bordered bg-primary w-full mb-3"
            v-model="psw.psw"
            placeholder="Password"
            type="password"
          />
          <input
            class="input input-md input-bordered bg-primary w-full mb-5"
            v-model="confirm"
            placeholder="Confirm"
            type="password"
          />
          <q-btn
            class="block btn btn-md btn-primary"
            @click="resetPassword()"
            :loading="pswLoading"
            >save password</q-btn
          >
        </fieldset>
      </form>
    </div>
  </div>
</template>
