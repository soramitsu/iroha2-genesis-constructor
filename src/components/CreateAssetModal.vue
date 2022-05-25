<template>
  <n-button type="primary" @click="show = true">
    Create Asset
  </n-button>

  <n-modal
    v-model:show="show"
    preset="card"
    style="width: 600px"
    title="Create Asset"
    :bordered="false"
    size="huge"
    @after-leave="name = ''"
  >
    <n-input
      v-model:value="name"
      type="text"
      placeholder="Name"
      :status="validation.status === 'error' ? 'error' : undefined"
    />

    <n-text :type="validation.status">{{ validation.message }}</n-text>

    <template #footer>
      <n-button type="primary" :disabled="validation.status !== 'success' " @click="create">
        Create
      </n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NInput, NButton, NText } from 'naive-ui';
import { computed, ref } from 'vue';
import { useAssets, useDomains } from '@/composables/data';
import { useValidator } from '@/composables/validation';

const domains = useDomains();
const assets = useAssets();
const validator = useValidator();

const show = ref(false);
const name = ref('');

const existence = computed(() => assets.list.value
  .some(a => a.name === name.value && domains.active.value === a.domain),
);

const validation = computed(() => validator.name(name.value, existence.value));

function create() {
  assets.create({
    name: name.value,
    domain: domains.active.value,
  });

  show.value = false;
}
</script>
