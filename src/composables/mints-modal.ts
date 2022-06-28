import { readonly, ref, watch } from 'vue';
import { Account } from './data';

const activeAccount = ref<Account | null>(null);
const show = ref(false);

export function useMintsModal() {
  function open(account: Account) {
    activeAccount.value = account;
    show.value = true;
  }

  watch(show, (value) => {
    if (!value) activeAccount.value = null;
  });

  return {
    open,
    show,
    account: readonly(activeAccount),
  };
}
