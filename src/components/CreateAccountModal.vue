<template>
  <n-button type="primary" @click="openModal">
    Create Account
  </n-button>

  <n-modal
    v-model:show="show"
    preset="card"
    style="width: 600px"
    title="Create Account"
    :bordered="false"
    size="huge"
    @after-leave="clear"
  >
    <n-space vertical>
      <n-input
        v-model:value="name"
        type="text"
        :status="validation.status === 'error' ? 'error' : undefined"
        placeholder="Name"
      />

      <n-text :type="validation.status">{{ validation.message }}</n-text>

      <n-space>
        <n-switch v-model:value="keyWillBeSaved" />
        <n-text>Save key as file</n-text>
      </n-space>

      <n-text :type="keyWillBeSaved ? 'primary' : 'warning'">
        {{ keyWillBeSaved ? 'Private key will be saved as a file on account creating ' : 'Make sure you copy and save the private key' }}
      </n-text>
    </n-space>

    <template #footer>
      <n-space>
        <n-button type="warning" @click="copyKey">Copy private key</n-button>

        <n-button type="primary" :disabled="disabled" @click="create">
          Create
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NInput, NButton, NText, NSpace, NSwitch, useMessage } from 'naive-ui';
import { computed, ref } from 'vue';
import { useAccounts, useDomains } from '@/composables/data';
import { KeyPair, useIroha } from '@/composables/iroha';
import { useValidator } from '@/composables/validation';
import { saveFile } from '@/lib/file';

const domains = useDomains();
const accounts = useAccounts();
const iroha = useIroha();
const message = useMessage();
const validator = useValidator();

const show = ref(false);
const name = ref('');
const keys = ref<KeyPair | null>(null);
const keyHasCopied = ref(false);
const keyWillBeSaved = ref(true);

const disabled = computed(() => (!keyHasCopied.value && !keyWillBeSaved.value) || validation.value.status !== 'success');

const existance = computed(() => accounts.list.value
  .some(a => a.name === name.value && domains.active.value === a.domain),
);

const validation = computed(() => validator.name(name.value, existance.value));

function openModal() {
  show.value = true;
  keys.value = iroha.createKeyPair();
  keyHasCopied.value = false;
}

function clear() {
  name.value = '';
  keys.value = null;
  keyHasCopied.value = false;
}

function create() {
  const signatories = [];
  if (keys.value) {
    signatories.push(keys.value.public);
  }

  accounts.create({
    name: name.value,
    domain: domains.active.value,
    signatories,
  });

  if (keyWillBeSaved.value) {
    if (!keys.value) {
      message.error('Private key is not available');
      return;
    }

    saveFile(
      keys.value.private,
      `${name.value}__${domains.active.value}.hex.key`,
      'application/octet-stream',
    );
  }

  show.value = false;
}

function copyKey() {
  if (!keys.value) {
    message.error('Private key is not available');
    return;
  }

  try {
    navigator.clipboard.writeText(keys.value.private);
    message.success('Private key has been copied');
    keyHasCopied.value = true;
  } catch {
    keyHasCopied.value = true;
    message.error('Copy to clipboard is not allowed in this browser');
    message.warning('Save this private key: ' + keys.value.private, {
      closable: true,
      duration: 10000,
      keepAliveOnHover: true,
    });
  }
}
</script>
