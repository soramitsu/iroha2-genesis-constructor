<template>
  <div v-if="domains.active.value" class="domain-detail">
    <h2 class="sora-tpg-h1 domain-detail__title">{{ domains.active.value }}</h2>

    <div class="domain-detail__container">
      <accounts-list />
      <assets-list />
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountsList from './AccountsList.vue';
import AssetsList from './AssetsList.vue';
import { useDomains } from '@/composables/data';

const domains = useDomains();
</script>

<style lang="scss">
.domain-detail {
  padding: 0 16px;
  margin: 16px 0;

  &__container {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  &__title {
    margin-bottom: 16px;
  }
}
</style>
