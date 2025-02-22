<template>
    <div>
    <AdminTableWalletAddressList />
    </div>
</template>

<script setup lang="ts">
import { AdminTableWalletAddressList } from '#components';

definePageMeta({
    layout: 'admin',
    middleware: ['admin-auths']
})


</script>