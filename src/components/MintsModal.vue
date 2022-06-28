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
        <div v-for="item in list" :key="item.key" class="mints-modal__card">
          <div class="mints-modal__card-top">
            <div>
              <div>
                <span class="sora-tpg-ch2">Name: </span>
                <span class="sora-tpg-p3">{{ item.asset.key }}</span>
              </div>

              <div>
                <span class="sora-tpg-ch2">Type: </span>
                <span class="sora-tpg-p3">{{ item.asset.type }}</span>
              </div>
            </div>

            <s-button
              type="action"
              size="sm"
              @click="mints.remove(item.key)"
            >
              <template #icon>
                <icon-close />
              </template>
            </s-button>
          </div>

          <s-text-field
            label="Value"
            :model-value="String(item.value)"
            @update:model-value="value => mints.setValue(item.key, value)"
          />
        </div>
      </div>
    </s-modal-card>
  </s-modal>
</template>

<script setup lang="ts">
import { SModal, SModalCard, SDropdown, SelectSize, STextField, SButton } from '@soramitsu-ui/ui';
import IconClose from '@soramitsu-ui/icons/icomoon/basic-close-24.svg';
import { useMintsModal } from '@/composables/mints-modal';
import { Account, Asset, useAssets, useMints } from '@/composables/data';
import { computed } from 'vue';

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
    value: 0,
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

  &__card {
    border: 1px solid #DDE0E1;
    border-radius: 12px;
    padding: 12px 16px;

    &-top {
      display: grid;
      grid-gap: 16px;
      grid-template-columns: 1fr auto;
    }
  }
}
</style>
