function toNaira(val: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);
  }
  export default defineNuxtPlugin((nuxtApp) => {
    if (import.meta.server) {
      nuxtApp.vueApp.directive("money", {
        mounted(el, binding) {
          el.innerText = binding.value;
        }
      });
    } else {
      nuxtApp.vueApp.directive("money", {
        mounted(el, binding) {
          el.innerText = toNaira(binding.value);
        },
        updated(el, binding) {
          el.innerText = toNaira(binding.value);
        },
      });
    }
  });
  