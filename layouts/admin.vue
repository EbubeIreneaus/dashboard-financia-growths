<template>
  <div>
    <aside class="top-0 left-0 w-full h-screen !bg-gradient-to-br from-slate-800 to-slate-950 z-[999] shadow open">
      <div class="mt-20">
        <q-list>
          <q-item
            :to="link.link"
            v-for="link in navLink"
            :key="link.title"
            class="mb-3"
            @click="() => closeNav()"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" color="blue-10" />
            </q-item-section>
            <q-item-section class="text-slate-50">
              {{ link.title }}</q-item-section
            >
          </q-item>
        </q-list>
      </div>
    </aside>

    <div class="cont navOpen">
      <AdminHeaderComp @togle-nav="toggleNav" />
      <main class="bg-black text-slate-50 min-h-screen p-5">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">

const navLink = [
  {
    title: "Dashboard",
    icon: "dashboard",
    link: "/admin/",
  },
  // {
  //   title: "Investment",
  //   icon: "manage_accounts",
  //   link: "/account",
  // },
  // {
  //   title: 'Wallet',
  //   icon: 'account_balance_wallet',
  //   link: '',
  // },
  {
    title: "Message",
    icon: "message",
    link: "/admin/message",
  },
  {
    title: "Investments",
    icon: "savings",
    link: "/admin/investment",
  },
  {
    title: "Transactions",

    icon: "account_balance",
    link: "/admin/transaction",
  },
  {
    title: "Users",
    icon: "diversity_2",
    link: "/admin/user",
  },
  {
    title: "Setting",
    icon: "settings",
    link: "/admin/setting",
  },
  {
    title: "Logout",
    icon: "logout",
    link: "/admin/auth/logout",
  },
];

function toggleNav() {
  document.querySelector("aside")?.classList.toggle("open");
  document.querySelector(".cont")?.classList.toggle("navOpen");
}

function closeNav() {
  if (window.innerWidth <= 800) {
    document.querySelector("aside")?.classList.remove("open");
    document.querySelector(".cont")?.classList.remove("navOpen");
  }
}

onMounted(() => {
  const aside = document.querySelector("aside");
  const cont = document.querySelector(".cont");
  const main = document.querySelector("main");

  if (window.innerWidth <= 800) {
    toggleNav();
  }

  main?.addEventListener("click", () => {
    if (window.innerWidth <= 800 && aside?.classList.contains("open")) {
      aside.classList.remove("open");
      cont?.classList.remove("navOpen");
    }
  });
});
</script>

<style scoped>
aside {
  position: fixed;
  max-width: 0;
  overflow: hidden;
  transition: all 0.1s linear;
}
aside.open {
  max-width: 250px;
}
.cont {
  width: 100dvw;
  margin-left: 0;
  transition: all 0.1s linear;
}
.cont.navOpen {
  width: calc(100dvw - 250px);
  margin-left: 250px;
}
@media screen and (max-width: 800px) {
  aside {
    position: absolute !important;
  }

  .cont.navOpen {
    width: 100%;
    margin-left: 0;
  }
}
</style>
