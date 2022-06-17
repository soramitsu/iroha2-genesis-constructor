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
        @keyup.enter="create"
      />

      <n-text :type="validation.status">{{ validation.message }}</n-text>

      <n-radio-group v-model:value="keyAction" name="radiogroup">
        <n-space vertical>
          <n-radio
            value="copy"
            label="Copy private key to clipboard"
          />

          <n-radio
            value="save"
            label="Save private key as file"
          />
        </n-space>
      </n-radio-group>

      <n-text type="warning">Make sure you copy or save the private key</n-text>
    </n-space>

    <template #footer>
      <n-button type="primary" :disabled="disabled" @click="create">
        Create
      </n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NInput, NButton, NText, NSpace, NRadio, NRadioGroup, useMessage } from 'naive-ui';
import { computed, ref } from 'vue';
import { useAccounts, useDomains } from '@/composables/data';
import { KeyPair, useIroha } from '@/composables/iroha';
import { validateName } from '@/lib/validation';
import { saveFile } from '@/lib/file';

const domains = useDomains();
const accounts = useAccounts();
const iroha = useIroha();
const message = useMessage();

const show = ref(false);
const name = ref('');
const keys = ref<KeyPair | null>(null);
const keyAction = ref<'save'|'copy'>('copy');

const disabled = computed(() => validation.value.status !== 'success');

const existance = computed(() => accounts.list.value
  .some(a => a.name === name.value && domains.active.value === a.domain),
);

const validation = computed(() => validateName(name.value, existance.value));

function openModal() {
  show.value = true;
  keys.value = iroha.createKeyPair();
}

function clear() {
  name.value = '';
  keys.value = null;
}

function create() {
  if (disabled.value) return;

  if (!keys.value) {
    message.error('Private key is not available');
    return;
  }

  accounts.create({
    name: name.value,
    domain: domains.active.value,
    signatories: [keys.value.public],
  });

  if (keyAction.value === 'save') {
    saveFile(
      keys.value.private,
      `${name.value}__${domains.active.value}.hex.key`,
      'application/octet-stream',
    );
  }

  if (keyAction.value === 'copy') {
    try {
      navigator.clipboard.writeText(keys.value.private);
      message.success('Private key has been copied');
    } catch {
      message.error('Copy to clipboard is not allowed in this browser');
      message.warning('Save this private key: ' + keys.value.private, {
        closable: true,
        duration: 10000,
        keepAliveOnHover: true,
      });
    }
  }

  show.value = false;
}
</script>
