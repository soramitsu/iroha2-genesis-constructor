<template>
  <s-modal v-model:show="dialog.show.value" @keyup.enter.prevent="onEnter">
    <s-modal-card title="Confirm">
      {{ dialog.text.value }}
      <div class="app-dialog__actions">
        <s-button @click="dialog.cancel">Cancel</s-button>
        <s-button ref="okEl" type="primary" @click="dialog.ok">Ok</s-button>
      </div>
    </s-modal-card>
  </s-modal>
</template>

<script setup lang="ts">
import { useDialog } from '@/composables/dialog';
import { SModal, SModalCard, SButton } from '@soramitsu-ui/ui';

const dialog = useDialog();

function onEnter() {
  if (dialog.show.value) {
    dialog.ok();
  }
}
</script>

<style lang="scss">
.app-dialog__actions {
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 8px;
  justify-content: end;
  margin-top: 16px;
}
</style>
