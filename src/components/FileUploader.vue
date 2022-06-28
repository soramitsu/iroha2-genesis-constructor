<template>
  <label class="file-uploader">
    <input
      ref="inputEL"
      class="file-uploader__input"
      type="file"
      @change="handle"
    >
    <slot />
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const inputEL = ref<HTMLInputElement | null>(null);

type Emits = {
  (event: 'upload', file: File): void,
};

const emit = defineEmits<Emits>();

function handle() {
  const input = inputEL.value;
  if (!input) return;

  const file = input.files?.[0];
  if (!file) return;

  emit('upload', file);
  input.value = '';
}
</script>

<style lang="scss">
.file-uploader {
  cursor: pointer;

  &__input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
}

.file-uploader button {
  pointer-events: none;
}
</style>
