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
import { NTabs, NTabPane, useDialog } from 'naive-ui';
import { ref } from 'vue';
import CreateDomainModal from './CreateDomainModal.vue';
import DomainDetail from './DomainDetail.vue';
import { useDomains } from '@/composables/data';

const dialog = useDialog();
const domains = useDomains();
const showCreateModel = ref(false);

function remove(name: string) {
  dialog.warning({
    title: 'Confirm',
    content: 'The domain and all data associated with it will be deleted',
    positiveText: 'Ok',
    negativeText: 'Cancel',
    onPositiveClick: () => domains.remove(name),
  });
}
</script>
