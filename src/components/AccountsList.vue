<template>
  <n-space vertical>
    <n-h3>Accounts</n-h3>

    <create-account-modal />

    <n-data-table
      :columns="columns"
      :data="list"
      :bordered="false"
      :row-key="x => x.name"
    />
  </n-space>
</template>

<script setup lang="ts">
import { NDataTable, DataTableColumns, NButton, NSpace, NH3 } from 'naive-ui';
import CreateAccountModal from './CreateAccountModal.vue';
import MintsList from './MintsList.vue';
import { Account, useAccounts, useDomains } from '@/composables/data';
import { computed, h } from 'vue';
import { useDialogWrapper } from '@/composables/dialog';

const domains = useDomains();
const accounts = useAccounts();
const list = computed(() => accounts.filter(domains.active.value));

const dialog = useDialogWrapper();

async function remove(name: string) {
  const res = await dialog.confirm('The account and all data associated with it will be deleted');
  if (!res) return;
  accounts.remove(name);
}

const columns: DataTableColumns<Account> = [
  {
    type: 'expand',
    renderExpand: (account) => h(MintsList, { account }),
    width: 30,
  },
  {
    title: 'Name',
    key: 'name',
  },
  {
    key: 'actions',
    align: 'right',
    render: (account) => h(
      NButton, {
        type: 'error',
        size: 'small',
        onClick: () => remove(account.name),
      },
      { default: () => 'Delete' }),
  },
];
</script>
