<template>
  <n-tabs
    v-model:value="domains.active.value"
    type="card"
    addable
    closable
    tab-style="min-width: 80px;"
    @close="remove"
    @add="showCreateModel = true"
  >
    <n-tab-pane v-for="domain in domains.list.value" :key="domain.name" :name="domain.name">
      <domain-detail />
    </n-tab-pane>

    <template #prefix>
      Domains:
    </template>
  </n-tabs>

  <create-domain-modal v-model:show="showCreateModel" />
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui';
import { ref } from 'vue';
import CreateDomainModal from './CreateDomainModal.vue';
import DomainDetail from './DomainDetail.vue';
import { useDomains } from '@/composables/data';
import { useDialogWrapper } from '@/composables/dialog';

const dialog = useDialogWrapper();
const domains = useDomains();
const showCreateModel = ref(false);

async function remove(name: string) {
  const res = await dialog.confirm('The domain and all data associated with it will be deleted');
  if (!res) return;
  domains.remove(name);
}
</script>
