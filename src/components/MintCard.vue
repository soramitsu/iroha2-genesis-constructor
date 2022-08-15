<template>
  <div class="mint-card">
    <div class="mint-card__top">
      <div>
        <div>
          <span class="sora-tpg-ch2">Name: </span>
          <span class="sora-tpg-p3">{{ item.asset.key }}</span>
        </div>

        <div>
          <span class="sora-tpg-ch2">Type: </span>
          <span class="sora-tpg-p3">{{ item.asset.value_type }}</span>
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
      :model-value="item.value"
      @update:model-value="value => set(item, value)"
    />

    <span class="sora-tpg-p3">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { AssetType, Mint, useMints } from '@/composables/data';
import { validateValue } from '@/lib/validation';
import { STextField, SButton } from '@soramitsu-ui/ui';
import IconClose from '@soramitsu-ui/icons/icomoon/basic-close-24.svg';
import { ref } from 'vue';

const mints = useMints();

const props = defineProps<{item: Mint}>();

const valueMessageMap = {
  [AssetType.Quantity]: 'Valid values are integers from 0 to 4294967295',
  [AssetType.BigQuantity]: 'Valid values are integers from 0 to 340282366920938463463374607431768211455',
  [AssetType.Fixed]: 'Valid values are fractional numbers from 0 to 9223372036',
  [AssetType.Store]: '',
};

const message = ref(valueMessageMap[props.item.asset.value_type]);

async function set(mint: Mint, value: string) {
  const val = value ? value.replace(/^0+/, '') : '0';
  const res = await validateValue(val, mint.asset.value_type);

  if (res.ok) {
    mints.setValue(mint.key, val);
  };
}
</script>

<style lang="scss">
.mint-card {
  border: 1px solid #DDE0E1;
  border-radius: 12px;
  padding: 12px 16px;

  &__top {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr auto;
  }
}
</style>
