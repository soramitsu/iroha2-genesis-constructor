<template>
  <header class="app-header" justify="space-between" align="center">
    <h1 class="sora-tpg-d2 app-header__title">RawGenesisBlock</h1>

    <div class="app-header__buttons">
      <file-uploader @upload="upload">
        <s-button type="primary">
          Open JSON
        </s-button>
      </file-uploader>

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
import FileUploader from './FileUploader.vue';
import { useDomains, useJsonData } from '@/composables/data';
import { readFile, saveFile } from '@/lib/file';
import { useDialog } from '@/composables/dialog';
import { useNoti } from '@/composables/noti';

const data = useJsonData();
const dialog = useDialog();
const noti = useNoti();
const domains = useDomains();

async function upload(file: File) {
  if (domains.list.value.length) {
    const res = await dialog.confirm('Active data will be deleted and replaced with the data from the file');
    if (!res) return;
  }

  readFile(file, 'application/json')
    .then(data.set)
    .catch((e: Error) => noti.error(e.message));
}

function save() {
  saveFile(data.get(), 'genesis.json', 'application/json');
  noti.success('Data has been copied');
}

function copy() {
  try {
    navigator.clipboard.writeText(data.get());
    noti.success('Data has been copied');
  } catch {
    noti.error('Copy to clipboard is not allowed in this browser');
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
