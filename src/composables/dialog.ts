import { ref, watch } from 'vue';

const show = ref(false);
const text = ref('');
let resolve: ((value: boolean) => void) | null = null;

export function useDialog() {
  function confirm(message: string): Promise<boolean> {
    show.value = true;
    text.value = message;

    return new Promise(_resolve => {
      resolve = _resolve;
    });
  }

  function ok() {
    if (resolve) {
      resolve(true);
      resolve = null;
    }

    show.value = false;
  }

  function cancel() {
    show.value = false;
  }

  watch(show, (value) => {
    if (!value) {
      text.value = '';

      if (resolve) {
        resolve(false);
        resolve = null;
      }
    }
  });

  return {
    confirm,
    show,
    text,
    ok,
    cancel,
  };
}
