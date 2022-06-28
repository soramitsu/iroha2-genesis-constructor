<template>
  <s-notifications-provider horizontal="center" vertical="top">
    <app-header />
    <domains-list />
    <domain-detail />
    <mints-modal />
    <app-dialog />
  </s-notifications-provider>
</template>

<script setup lang="ts">
import { SNotificationsProvider } from '@soramitsu-ui/ui';
import DomainsList from '@/components/DomainsList.vue';
import AppHeader from '@/components/AppHeader.vue';
import DomainDetail from './components/DomainDetail.vue';
import MintsModal from './components/MintsModal.vue';
import AppDialog from './components/AppDialog.vue';
</script>

<style lang="scss">
@use '@soramitsu-ui/theme/fonts/Sora';
@use '@soramitsu-ui/theme/sass' as theme;

@include theme.typography-preset-default;

:root {
  @include theme.tokens-preset-light;
}

.s-notification-body .sora-tpg-p2 {
  max-width: calc(100vw - 200px);
  word-wrap: break-word;
}

.sora-tpg-ch2 {
  color: theme.token-as-var('sys.color.content-tertiary');
}

.table-row {
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  box-shadow: inset 0px -1px 0px #F5F7F8;
  min-height: 48px;

  & > * {
    margin: 12px 16px;
  }

  & > button {
    justify-self: end;
  }
}
</style>
