<template>
  <n-button
    type="primary"
    size="tiny"
    text
    @click="show = true"
  >
    Create Mint
  </n-button>

  <n-modal
    v-model:show="show"
    preset="card"
    style="width: 600px"
    title="Create Mint"
    :bordered="false"
    size="huge"
    @after-leave="clear"
  >
    <n-space vertical>
      <n-form-item label="Asset">
        <n-select v-model:value="assetKey" :options="assetOptions" />
      </n-form-item>

      <n-form-item label="Value">
        <n-input-number v-model:value="value" />
      </n-form-item>
    </n-space>

    <template #footer>
      <n-button type="primary" :disabled="!asset || !value" @click="create">
        Create
      </n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NSelect, NInputNumber, NButton, NSpace, NFormItem } from 'naive-ui';
import { computed, ref } from 'vue';
import { Account, Asset, useAssets, useMints } from '@/composables/data';

type Props = {
  account: Account,
};

const props = defineProps<Props>();

const mints = useMints();
const assets = useAssets();

const show = ref(false);

const assetOptions = computed(() => assets.list.value
  .filter(a => !mints.list.value
    .some(m => m.asset.key === a.key && m.account.key === props.account.key),
  )
  .map(({ key }) => ({ label: key, value: key })),
);

const value = ref(0);
const assetKey = ref('');

const asset = computed(() => assets.list.value.find(asset => asset.key === assetKey.value));

function clear() {
  value.value = 0;
  assetKey.value = '';
}

function create() {
  mints.create({
    account: props.account,
    asset: asset.value as Asset,
    value: value.value,
  });

  show.value = false;
}
</script>
