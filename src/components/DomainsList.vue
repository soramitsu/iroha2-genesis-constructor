<template>
  <div class="domains-list">
    <div class="domains-list__row">
      <s-text-field v-model="name" label="Domain name" @keyup.enter="add" />

      <s-button size="lg" @click="add">Add domain</s-button>
    </div>

    <div class="domains-list__row">
      <span class="sora-tpg-h4">Domains:</span>

      <s-button
        v-for="domain in domains.list.value"
        :key="domain.name"
        :type="domain.name === domains.active.value ? 'primary' : 'secondary'"
        icon-position="right"
        size="sm"
        @click="domains.active.value = domain.name"
      >
        {{ domain.name }}
        <template #icon>
          <close-icon @click="remove(domain.name)" />
        </template>
      </s-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { STextField, SButton } from '@soramitsu-ui/ui';
import CloseIcon from '@soramitsu-ui/icons/icomoon/x-16.svg';
import { ref } from 'vue';
import { useDomains } from '@/composables/data';
import { useDialog } from '@/composables/dialog';
import { validateName } from '@/lib/validation';
import { useNoti } from '@/composables/noti';

const dialog = useDialog();
const domains = useDomains();
const noti = useNoti();

const name = ref('');

function add() {
  const existence = domains.list.value.some(d => d.name === name.value);
  const validation = validateName(name.value, existence);
  if (!validation.ok) {
    noti.error(validation.message);
    return;
  };

  domains.create({ name: name.value });
  domains.active.value = name.value;
  name.value = '';
}

async function remove(name: string) {
  const res = await dialog.confirm('The domain and all data associated with it will be deleted');
  if (!res) return;
  domains.remove(name);
}
</script>

<style lang="scss">
.domains-list {
  padding: 0 16px;
  margin: 16px 0;

  &__create {
    display: grid;
  }

  &__row {
    margin-bottom: 16px;
    display: grid;
    grid-gap: 16px;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    align-items: center;
    justify-content: start;
  }
}
</style>
