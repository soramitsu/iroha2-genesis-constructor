<template>
  <n-h2>{{ domains.active.value }}</n-h2>

  <n-divider />

  <n-grid :cols="2" x-gap="24">
    <n-gi>
      <accounts-list />
    </n-gi>

    <n-gi>
      <assets-list />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGi, NH2, NDivider } from 'naive-ui';
import AccountsList from './AccountsList.vue';
import AssetsList from './AssetsList.vue';
import { useDomains } from '@/composables/data';

const domains = useDomains();
</script>
