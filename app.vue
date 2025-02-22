<script setup lang="ts">
interface CustomWindow extends Window {
  gtranslateSettings?: {
    default_language: string;
    languages: string[];
    wrapper_selector: string;
    flag_style: string;
  };
}

declare let window: CustomWindow;

onMounted(() => {
  const loader = document.getElementById("loader");
  loader?.classList.add("fade-out");

  window.gtranslateSettings = {
    default_language: "en",
    languages: ["en", "fr", "it", "es", "ru", "de", "tr", "sw", "sv"],
    wrapper_selector: ".gtranslate_wrapper",
    flag_style: "3d"
  };

  const script = document.createElement("script");
  script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
  script.defer = true;
  document.body.appendChild(script);
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>

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
