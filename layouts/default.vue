<template>
  <div>
    <aside class="top-0 left-0 w-full h-screen !bg-primary z-[999] shadow open">
      <div class="mt-20">
        <q-list>
          <q-item :to="link.link" v-for="link in navLink" :key="link.title" class="mb-3" @click="()=>closeNav()">
            <q-item-section avatar>
              <q-icon :name="link.icon" color="blue-10" />
            </q-item-section>
            <q-item-section class="text-slate-50">
              {{ link.title }}</q-item-section
            >
          </q-item>
        </q-list>
      </div>

      <div class="mb-20">
        <div class="absolute bottom-0 card text-white bg-slate-950 text-center max-w-xs w-full mx-auto">
        <div class="card-body">
          <p>let us know what you need?</p>
          <nuxt-link to="/contact"  class="btn btn-sm btn-blue-500  mx-auto">contact us</nuxt-link>
        </div>
      </div>
      </div>
    </aside>

    <div class="cont navOpen">
      <MainHeaderComp @togle-nav="toggleNav" />
     <main class="bg-black text-slate-50 min-h-screen p-5 pb-20">
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
    link: "/",
  },
  {
    title: "Profile",
    icon: "manage_accounts",
    link: "/account",
  },
  // {
  //   title: 'Wallet',
  //   icon: 'account_balance_wallet',
  //   link: '',
  // },
  // {
  //   title: 'Deposit',
  //   icon: 'payments',
  //   link: '/deposit',
  // },
  {
    title: "Invest",
    icon: "savings",
    link: "/invest",
  },
  {
    title: "Withdraw",

    icon: "account_balance",
    link: "/withdrawal",
  },
  {
    title: "Affliate",
    icon: "diversity_2",
    link: "/affliate",
  },
  {
    title: "Logout",
    icon: "logout",
    link: "/auth/logout",
  },
];

function toggleNav() {
  document.querySelector("aside")?.classList.toggle("open");
  document.querySelector(".cont")?.classList.toggle("navOpen");
}

function closeNav(){
  if (window.innerWidth <= 800) {
    document.querySelector("aside")?.classList.remove("open");
  document.querySelector(".cont")?.classList.remove("navOpen");
  }
}

onMounted(() => {
  const aside = document.querySelector("aside")
  const cont =  document.querySelector(".cont")
  const main = document.querySelector('main')

  if (window.innerWidth <= 800) {
    toggleNav()
  }

  main?.addEventListener('click', () => {
    if (window.innerWidth <= 800 && aside?.classList.contains('open')) {
      aside.classList.remove('open')
      cont?.classList.remove('navOpen')
    }
  })
})
</script>

<style scoped>
aside {
  position: fixed;
  max-width: 0;
  overflow: hidden;
  transition: all 0.1s linear;
  overflow: auto;
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
