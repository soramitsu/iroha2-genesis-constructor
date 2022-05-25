<template>
  <n-space style="margin-bottom: 20px;" justify="space-between" align="center">
    <n-h1 style="margin: 0;">RawGenesisBlock constructor</n-h1>

    <n-space>
      <n-upload ref="upload" :show-file-list="false" @change="handleUpload">
        <n-button type="info" ghost>
          Open JSON file
        </n-button>
      </n-upload>

      <n-button type="info" ghost @click="copy">
        Copy JSON
      </n-button>

      <n-button type="info" ghost @click="save">
        Save as JSON
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { NButton, NSpace, NH1, NUpload, UploadInst, UploadFileInfo, useDialog, useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useJsonData } from '@/composables/data';

const data = useJsonData();
const dialog = useDialog();
const message = useMessage();

const upload = ref<UploadInst | null>(null);

function readFromFile(file: File) {
  if (file.type !== 'application/json') {
    message.error('Wrong file type');
    return;
  }

  const reader = new FileReader();
  reader.readAsText(file);

  reader.onload = () => {
    try {
      data.set(reader.result as string);
    } catch (e) {
      message.error('Data parsing error');
      console.error(e);
    }
  };
}

function handleUpload(_data: { file: UploadFileInfo }) {
  const { file } = _data.file;
  if (!file) return;

  dialog.warning({
    title: 'Confirm',
    content: 'Active data will be deleted and replaced with the data from the file',
    positiveText: 'Ok',
    negativeText: 'Cancel',
    onPositiveClick: () => readFromFile(file),
  });
}

function save() {
  const file = new Blob([data.get()], { type: 'application/json' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(file);
  link.setAttribute('href', url);
  link.setAttribute('download', 'genesis.json');
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

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
