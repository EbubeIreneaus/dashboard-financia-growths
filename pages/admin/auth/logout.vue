<template>
    <div>

    </div>
</template>

<script setup lang="ts">
const router = useRouter()
useCookie('Authorization').value = null
router.replace('/admin/auth/')
</script>

<style scoped>

</style>