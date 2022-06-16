<template>
  <n-space style="margin-bottom: 20px;" justify="space-between" align="center">
    <n-h1 style="margin: 0;">RawGenesisBlock constructor</n-h1>

    <n-space>
      <n-upload ref="upload" :show-file-list="false" @change="handleUpload">
        <n-button type="info" ghost>
          Open JSON file
        </n-button>
      </n-upload>

      <n-button
        type="info"
        ghost
        tabindex="0"
        @click="copy"
      >
        Copy JSON
      </n-button>

      <n-button
        type="info"
        ghost
        tabindex="0"
        @click="save"
      >
        Save as JSON
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { NButton, NSpace, NH1, NUpload, UploadInst, UploadFileInfo, useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useJsonData } from '@/composables/data';
import { readFile, saveFile } from '@/lib/file';
import { useDialogWrapper } from '@/composables/dialog';

const data = useJsonData();
const dialog = useDialogWrapper();
const message = useMessage();

const upload = ref<UploadInst | null>(null);

async function handleUpload(uploadData: { file: UploadFileInfo }) {
  const { file } = uploadData.file;
  if (!file) return;

  const res = await dialog.confirm('Active data will be deleted and replaced with the data from the file');

  if (!res) return;

  readFile(file, 'application/json')
    .then(data.set)
    .catch((e: Error) => message.error(e.message));
}

function save() {
  saveFile(data.get(), 'genesis.json', 'application/json');
  message.success('Data has been copied');
}

function copy() {
  try {
    navigator.clipboard.writeText(data.get());
    message.success('Data has been copied');
  } catch {
    message.error('Copy to clipboard is not allowed in this browser');
  }
}

</script>
