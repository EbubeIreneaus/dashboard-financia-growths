<script setup lang="ts">
interface CustomWindow extends Window {
  gtranslateSettings?: {
    default_language: string;
    languages: string[];
    wrapper_selector: string;
    flag_style: string;
  };
}
const showDesktopInstall = ref(false);
const showIosInstall = ref(false);
let deferredPrompt: any = null;

declare let window: CustomWindow;

const installApp = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") {
    showDesktopInstall.value = false;
  }
};

onMounted(() => {
  const isIos =
    typeof window !== "undefined" &&
    /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
  const isInStandalone =
    typeof window !== "undefined" &&
    "standalone" in navigator &&
    (navigator as any).standalone;

  const loader = document.getElementById("loader");
  loader?.classList.add("fade-out");

  window.gtranslateSettings = {
    default_language: "en",
    languages: ["en", "fr", "it", "es", "ru", "de", "tr", "sw", "sv"],
    wrapper_selector: ".gtranslate_wrapper",
    flag_style: "3d",
  };

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showDesktopInstall.value = true;
  });

  if (isIos && !isInStandalone) {
    showIosInstall.value = true;
  }

  const script = document.createElement("script");
  script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
  script.defer = true;
  document.body.appendChild(script);
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>

    <div
      v-if="showDesktopInstall"
      class="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center"
      >
        <h2 class="text-lg font-semibold text-gray-800">
          Install Financial Growths
        </h2>
        <p class="text-gray-600 mt-2">
          Get quick access by installing the app to your device.
        </p>
        <div class="mt-4 flex justify-center gap-3">
          <button
            @click="installApp"
            class="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/50"
          >
            Install
          </button>
          <button
            @click="showDesktopInstall = false"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Later
          </button>
        </div>
      </div>
    </div>

     <div v-if="showIosInstall" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
      <h2 class="text-lg font-semibold text-gray-800">Add to Home Screen</h2>
      <p class="text-gray-600 mt-2">
        To install this app, tap 
        <span class="inline-block px-2 py-1 bg-gray-100 rounded-md">Share</span> 
        <br> then <strong>Add to Home Screen</strong>.
      </p>
      <img src="/ios-install-guide.png" alt="iOS Install Guide" class="mt-4 mx-auto w-40">
      <div class="mt-4">
        <button 
          @click="showIosInstall = false"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          Got it
        </button>
      </div>
    </div>
  </div>


    <div class="gtranslate_wrapper"></div>

    <div class="loader" id="loader">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  background-color: #292d36; /* Dark background */
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 80px;
  height: 80px;
  border: 8px solid #ffffd6; /* Darker border for contrast */
  border-top: 8px solid #292d36; /* Accent color */
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

/* Spinner Animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Optional Fade-Out Effect */
.loader.fade-out {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.page-enter-active,
.page-leave-active,
.layout-enter-active,
.layout-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.page-enter-from,
.layout-enter-from {
  /* transform: translateX(100%);
  opacity: 0; */
}
.page-leave-to,
.layout-leave-to {
  /* transform: translateX(-100%);
  opacity: 0; */
}
</style>
