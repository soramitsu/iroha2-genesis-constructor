<template>
  <n-button
    type="primary"
    size="tiny"
    text
    @click="logic.show.value = true"
  >
    Edit
  </n-button>

  <n-modal
    v-model:show="logic.show.value"
    preset="card"
    style="width: 600px"
    title="Edit Mint"
    :bordered="false"
    size="huge"
    @after-leave="logic.clear"
  >
    <n-space vertical>
      <n-form-item label="Asset">
        <n-select
          ref="assetEl"
          v-model:value="logic.assetKey.value"
          :options="logic.assetOptions.value"
          @keyup.enter="logic.submit"
        />
      </n-form-item>

      <n-form-item label="Value">
        <n-input-number
          ref="valueEl"
          v-model:value="logic.value.value"
          :min="0"
          :max="logic.MAX_VALUE"
          @keyup.enter="logic.submit"
        />
      </n-form-item>
    </n-space>

    <template #footer>
      <n-button type="primary" :disabled="logic.disabled.value" @click="logic.submit">
        Edit
      </n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NSelect, NInputNumber, NButton, NSpace, NFormItem } from 'naive-ui';
import { ref, toRefs } from 'vue';
import { Mint } from '@/composables/data';
import { useMintModal } from '@/composables/mint-modal';

type Props = {
  mint: Mint,
};

const props = defineProps<Props>();
const { mint } = toRefs(props);
const valueEl = ref<InstanceType<typeof NInputNumber> | null>(null);
const assetEl = ref<InstanceType<typeof NSelect> | null>(null);

const logic = useMintModal({
  account: mint.value.account,
  valueEl,
  assetEl,
  editMint: mint,
});
</script>
