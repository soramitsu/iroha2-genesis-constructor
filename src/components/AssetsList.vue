<template>
  <base-table class="assets-list">
    <template #header>
      <div class="assets-list__header">
        <h3 class="sora-tpg-h3">Asset Definition</h3>

        <div class="assets-list__form-row">
          <s-text-field v-model="name" label="Asset name" @keyup.enter="add" />

          <s-dropdown
            v-model="type"
            :size="SelectSize.Xl"
            :options="typeOptions"
            label="Type"
          />
        </div>

        <s-button type="primary" @click="add">Add</s-button>
      </div>
    </template>

    <template #body>
      <div class="table-row">
        <span class="sora-tpg-ch2">Name</span>
        <span class="sora-tpg-ch2">Type</span>
      </div>

      <div v-for="item in list" :key="item.key" class="table-row">
        <span class="sora-tpg-p3">{{ item.name }}</span>
        <span class="sora-tpg-p3">{{ item.value_type }}</span>
        <s-button size="sm" @click="remove(item.key)">Remove</s-button>
      </div>
    </template>
  </base-table>
</template>

<script setup lang="ts">
import { STextField, SButton, SDropdown, SelectSize } from '@soramitsu-ui/ui';
import BaseTable from './BaseTable.vue';
import { AssetType, useAssets, useDomains } from '@/composables/data';
import { computed, ref } from 'vue';
import { useDialog } from '@/composables/dialog';
import { validateName } from '@/lib/validation';
import { useNoti } from '@/composables/noti';

const domains = useDomains();
const assets = useAssets();
const noti = useNoti();
const dialog = useDialog();

const list = computed(() => assets.filter(domains.active.value));
const typeOptions = [
  { label: 'Quantity', value: AssetType.Quantity },
  { label: 'Big Quantity', value: AssetType.BigQuantity },
  { label: 'Fixed Point Fraction', value: AssetType.Fixed },
  { label: 'Store', value: AssetType.Store },
];

const name = ref('');
const type = ref(AssetType.Quantity);

function add() {
  const existence = assets.list.value
    .some(a => a.name === name.value && domains.active.value === a.domain);

  const validation = validateName(name.value, existence);

  if (!validation.ok) {
    noti.error(validation.message);
    return;
  };

  if (!type.value) {
    noti.error('Asset type is a required field');
    return;
  };

  if (type.value === AssetType.Store) {
    noti.error('Type "Store" is not yet implemented');
    return;
  };

  assets.create({
    name: name.value,
    domain: domains.active.value,
    value_type: type.value,
  });

  name.value = '';
  type.value = AssetType.Quantity;
}

async function remove(name: string) {
  const res = await dialog.confirm('The asset and all data associated with it will be deleted');
  if (!res) return;
  assets.remove(name);
}
</script>

<style lang="scss">
.assets-list {
  &__header {
    display: grid;
    grid-gap: 8px;
    grid-column: auto;
    justify-items: start;
  }

  &__form-row {
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    justify-content: start;
  }
}
</style>
