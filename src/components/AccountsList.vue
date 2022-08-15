<template>
  <base-table class="accounts-list">
    <template #header>
      <div class="accounts-list__header">
        <h3 class="sora-tpg-h3">Accounts</h3>

        <s-text-field v-model="name" label="Account name" @keyup.enter="add" />

        <s-radio-group v-model="keyAction" class="accounts-list__radio-group">
          <s-radio value="save">Generate keys and save</s-radio>
          <s-radio value="copy">Generate keys</s-radio>
          <s-radio value="enter">Enter public key</s-radio>
        </s-radio-group>

        <s-text-field
          v-if="keyAction === 'enter'"
          v-model="publicKey"
          label="Public key"
          style="width: 100%"
          @keyup.enter="add"
        />

        <s-button type="primary" @click="add">Add</s-button>
      </div>
    </template>

    <template #body>
      <div class="table-row">
        <span class="sora-tpg-ch2">Name</span>
      </div>

      <div v-for="item in list" :key="item.key" class="table-row">
        <span class="sora-tpg-p3">{{ item.name }}</span>

        <div class="accounts-list__row-actions">
          <s-button type="outline" size="sm" @click="mintsModal.open(item)">Assets</s-button>

          <s-button size="sm" @click="remove(item.key)">Remove</s-button>
        </div>
      </div>
    </template>
  </base-table>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseTable from './BaseTable.vue';
import { STextField, SButton, SRadio, SRadioGroup } from '@soramitsu-ui/ui';
import { useAccounts, useDomains, usePrivateKeys } from '@/composables/data';
import { useIroha } from '@/composables/iroha';
import { useDialog } from '@/composables/dialog';
import { useNoti } from '@/composables/noti';
import { validateName } from '@/lib/validation';
import { useMintsModal } from '@/composables/mints-modal';
import { writeText } from '@tauri-apps/api/clipboard';

const domains = useDomains();
const accounts = useAccounts();
const dialog = useDialog();
const iroha = useIroha();
const noti = useNoti();
const mintsModal = useMintsModal();
const privateKeysData = usePrivateKeys();

const list = computed(() => accounts.filter(domains.active.value));

const name = ref('');
const publicKey = ref('');
const keyAction = ref<'save'|'copy'|'enter'>('save');

async function remove(key: string) {
  const res = await dialog.confirm('The account and all data associated with it will be deleted');
  if (!res) return;
  accounts.remove(key);
}

async function copyKey(key: string) {
  try {
    await writeText(key);
    noti.success('Private key has been copied');
  } catch {
    noti.error('Copy to clipboard is not allowed');
    noti.warning('Save this private key: ' + key);
  }
}

async function add() {
  const existance = accounts.list.value
    .some(a => a.name === name.value && domains.active.value === a.domain);

  const validation = validateName(name.value, existance);

  if (!validation.ok) {
    noti.error(validation.message);
    return;
  };

  if (keyAction.value === 'enter') {
    if (!publicKey.value.length) {
      noti.error('Public key missing');
      return;
    }

    accounts.create({
      name: name.value,
      domain: domains.active.value,
      signatories: [publicKey.value],
    });
  } else {
    const keys = iroha.createKeyPair();

    if (keyAction.value === 'save') {
      privateKeysData.add({
        name: `${name.value}__${domains.active.value}.hex.key`,
        key: keys.private,
      });
    }

    await copyKey(keys.private); // copy anyway

    accounts.create({
      name: name.value,
      domain: domains.active.value,
      signatories: [keys.public],
    });
  }

  name.value = '';
  keyAction.value = 'save';
  publicKey.value = '';
}
</script>

<style lang="scss">
.accounts-list {
  &__header {
    display: grid;
    grid-gap: 8px;
    grid-column: auto;
    justify-items: start;
  }

  &__radio-group {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: auto auto auto;
  }

  &__row-actions {
    grid-column: 2 / -1;
    display: grid;
    grid-gap: 8px;
    justify-content: end;
    align-items: center;
    grid-template-columns: auto auto;
  }
}
</style>
