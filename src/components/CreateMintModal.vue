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
        <n-select
          ref="assetEl"
          v-model:value="assetKey"
          :options="assetOptions"
          @keyup.enter="create"
        />
      </n-form-item>

      <n-form-item label="Value">
        <n-input-number
          ref="valueEl"
          v-model:value="value"
          :min="0"
          :max="MAX_VALUE"
          @keyup.enter="create"
        />
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
import { NModal, NSelect, NInputNumber, NButton, NSpace, NFormItem, useMessage } from 'naive-ui';
import { computed, ref } from 'vue';
import { Account, Asset, useAssets, useMints } from '@/composables/data';

type Props = {
  account: Account,
};

const props = defineProps<Props>();

const mints = useMints();
const assets = useAssets();
const message = useMessage();

const show = ref(false);
const MAX_VALUE = 4_294_967_295;

const assetOptions = computed(() => assets.list.value
  .filter(a => !mints.list.value
    .some(m => m.asset.key === a.key && m.account.key === props.account.key),
  )
  .map(({ key }) => ({ label: key, value: key })),
);

const value = ref(0);
const assetKey = ref('');
const valueEl = ref<InstanceType<typeof NInputNumber> | null>(null);
const assetEl = ref<InstanceType<typeof NSelect> | null>(null);

const asset = computed(() => assets.list.value.find(asset => asset.key === assetKey.value));

function clear() {
  value.value = 0;
  assetKey.value = '';
}

function create() {
  if (!asset.value) {
    assetEl.value?.focus();
    return;
  }

  if (!value.value) {
    valueEl.value?.focus();
    return;
  }

  if (value.value > MAX_VALUE) {
    valueEl.value?.focus();
    message.error('Value is too big');
    return;
  }

  if (!Number.isInteger(value.value)) {
    valueEl.value?.focus();
    message.error('Value must be integer');
    return;
  }

  mints.create({
    account: props.account,
    asset: asset.value as Asset,
    value: value.value,
  });

  show.value = false;
}
</script>
