<template>
  <n-modal
    v-model:show="show"
    preset="card"
    style="width: 600px"
    title="Create Domain"
    :bordered="false"
    size="huge"
    @after-leave="name = ''"
  >
    <n-input
      v-model:value="name"
      type="text"
      placeholder="Name"
      :status="validation.status === 'error' ? 'error' : undefined"
      @keyup.enter="create"
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
import { useDomains } from '@/composables/data';
import { validateName } from '@/lib/validation';

type Props = {
  show: boolean;
}

type Emits = {
  (event: 'update:show', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const domains = useDomains();

const show = computed<boolean>({
  get() {
    return props.show;
  },
  set(value) {
    emit('update:show', value);
  },
});

const name = ref('');

const existence = computed(() => domains.list.value.some(d => d.name === name.value));
const validation = computed(() => validateName(name.value, existence.value));

function create() {
  domains.create({ name: name.value });
  domains.active.value = name.value;
  show.value = false;
}
</script>
