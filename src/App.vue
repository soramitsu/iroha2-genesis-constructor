<template>
  <n-dialog-provider>
    <n-message-provider>
      <n-layout content-style="padding: 30px 30px">
        <n-layout-header>
          <app-header />
        </n-layout-header>

        <n-layout-content>
          <domains-list />
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-dialog-provider>
</template>

<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutHeader, NDialogProvider, NMessageProvider } from 'naive-ui';
import DomainsList from '@/components/DomainsList.vue';
import AppHeader from '@/components/AppHeader.vue';
</script>

<style>
.n-tree .n-tree-node-content .n-tree-node-content__text {
  margin-right: 8px;
  flex-grow: 0;
}

.n-select {
  min-width: 200px;
}

.n-message__content {
  word-wrap: break-word;
  max-width: 600px;
}
</style>
