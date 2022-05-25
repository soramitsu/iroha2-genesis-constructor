<template>
  <n-space vertical>
    <n-grid v-for="mint in list" :key="mint.asset.name" cols="3">
      <n-gi>
        <n-text strong>Asset: <n-a @click="domains.active.value = mint.asset.domain">{{ mint.asset.key }}</n-a></n-text>
      </n-gi>

      <n-gi>
        <n-text strong>Value: <n-text type="info">{{ mint.value }}</n-text></n-text>
      </n-gi>

      <n-gi>
        <n-space justify="end">
          <n-button
            type="error"
            size="tiny"
            text
            @click="mints.remove(mint.key)"
          >
            Delete
          </n-button>
        </n-space>
      </n-gi>
    </n-grid>

    <create-mint-modal :account="props.account" />
  </n-space>
</template>

<script setup lang="ts">
import { NButton, NSpace, NText, NA, NGrid, NGi } from 'naive-ui';
import CreateMintModal from './CreateMintModal.vue';
import { Account, useDomains, useMints } from '@/composables/data';
import { computed } from 'vue';

type Props = {
  account: Account,
}

const props = defineProps<Props>();

const mints = useMints();
const domains = useDomains();

const list = computed(() => mints.list.value.filter((mint) => mint.account.key === props.account.key));
</script>
