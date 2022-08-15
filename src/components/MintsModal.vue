<template>
  <s-modal v-model:show="modal.show.value">
    <s-modal-card :title="`Assets for an account: ${modal.account.value?.key}`">
      <s-dropdown
        v-if="options.length"
        label="Add asset"
        :size="SelectSize.Lg"
        :options="options"
        @update:model-value="add"
      />

      <div class="mints-modal__grid">
        <mint-card v-for="item in list" :key="item.key" :item="item" />
      </div>
    </s-modal-card>
  </s-modal>
</template>

<script setup lang="ts">
import { SModal, SModalCard, SDropdown, SelectSize } from '@soramitsu-ui/ui';
import { useMintsModal } from '@/composables/mints-modal';
import { Account, Asset, useAssets, useMints } from '@/composables/data';
import { computed } from 'vue';
import MintCard from './MintCard.vue';

const modal = useMintsModal();
const mints = useMints();
const assets = useAssets();

const list = computed(() => mints.list.value.filter((mint) => mint.account.key === modal.account.value?.key));
const options = computed(() => assets.list.value
  .filter(a => !mints.list.value.some(m => m.asset.key === a.key && m.account.key === modal.account.value?.key))
  .map(({ key }) => ({ label: key, value: key })),
);

function add(assetKey: string) {
  mints.create({
    value: '0',
    account: modal.account.value as Account,
    asset: assets.list.value.find(a => a.key === assetKey) as Asset,
  });
}
</script>

<style lang="scss">
.mints-modal {
  &__grid {
    display: grid;
    grid-template-columns: 400px 400px 400px;
    grid-gap: 16px;
    margin-top: 16px;
  }
}
</style>
