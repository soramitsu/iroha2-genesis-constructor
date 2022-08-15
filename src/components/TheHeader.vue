<template>
  <header class="app-header" justify="space-between" align="center">
    <h1 class="sora-tpg-d2 app-header__title">RawGenesisBlock</h1>

    <div class="app-header__buttons">
      <s-button type="primary" @click="open">
        Open JSON
      </s-button>

      <s-button type="primary" @click="copy">
        Copy JSON
      </s-button>

      <s-button type="primary" @click="save">
        Save as JSON
      </s-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { SButton } from '@soramitsu-ui/ui';
import { useDomains, useData, CommandStatus } from '@/composables/data';
import { useDialog } from '@/composables/dialog';
import { useNoti } from '@/composables/noti';

const data = useData();
const dialog = useDialog();
const noti = useNoti();
const domains = useDomains();

async function open() {
  if (domains.list.value.length) {
    const res = await dialog.confirm('Active data will be deleted and replaced with the data from the file');
    if (!res) return;
  }

  const res = await data.open();
  switch (res) {
    case CommandStatus.Done: return noti.success('File successfully opened');
    case CommandStatus.Failed: return noti.error('Failed to read file');
    default: break;
  }
}

async function save() {
  const res = await data.save();
  switch (res) {
    case CommandStatus.Done: return noti.success('Data has been saved');
    case CommandStatus.Failed: return noti.error('Failed to save data');
    default: break;
  }
}

async function copy() {
  const res = await data.copy();
  switch (res) {
    case CommandStatus.Done: return noti.success('Data has been copied');
    case CommandStatus.Failed: return noti.error('Failed to generate json');
    default: break;
  }
}

</script>

<style lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  box-shadow: 0px 0px 8px rgba(45, 41, 38, 0.2);
  padding: 16px;
  margin-bottom: 16px;

  &__title {
    margin: 0;
  }

  &__buttons {
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;
    align-items: center;
    justify-content: end;
  }
}
</style>
