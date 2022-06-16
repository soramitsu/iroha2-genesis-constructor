<template>
  <n-space vertical>
    <n-h3>Asset Definition</n-h3>

    <create-asset-modal />

    <n-data-table
      :columns="columns"
      :data="list"
      :bordered="false"
    />
  </n-space>
</template>

<script setup lang="ts">
import { NDataTable, DataTableColumns, NButton, NSpace, NH3 } from 'naive-ui';
import CreateAssetModal from './CreateAssetModal.vue';
import { Asset, useAssets, useDomains } from '@/composables/data';
import { computed, h } from 'vue';
import { useDialogWrapper } from '@/composables/dialog';

const domains = useDomains();
const assets = useAssets();
const list = computed(() => assets.filter(domains.active.value));

const dialog = useDialogWrapper();

async function remove(name: string) {
  const res = await dialog.confirm('The asset and all data associated with it will be deleted');
  if (!res) return;
  assets.remove(name);
}

const columns: DataTableColumns<Asset> = [
  {
    title: 'Name',
    key: 'name',
    width: '50%',
  },
  {
    key: 'actions',
    align: 'right',
    render: (asset) => h(
      NButton, {
        type: 'error',
        size: 'small',
        onClick: () => remove(asset.name),
      },
      { default: () => 'Delete' }),
  },
];
</script>
