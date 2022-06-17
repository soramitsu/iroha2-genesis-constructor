import { NInputNumber, NSelect, useMessage } from 'naive-ui';
import { computed, ref, Ref } from 'vue';
import { Account, Asset, Mint, useAssets, useMints } from './data';

export type MintModalInitData = {
  account: Account,
  valueEl: Ref<InstanceType<typeof NInputNumber> | null>,
  assetEl: Ref<InstanceType<typeof NSelect> | null>,
  editMint?: Ref<Mint>,
}

export function useMintModal(initData: MintModalInitData) {
  const { account, valueEl, assetEl, editMint } = initData;

  const mints = useMints();
  const assets = useAssets();
  const message = useMessage();

  const show = ref(false);
  const MAX_VALUE = 4_294_967_295;

  const assetOptions = computed(() => {
    const list = editMint
      ? assets.list.value
      : assets.list.value.filter(a => !mints.list.value
        .some(m => m.asset.key === a.key && m.account.key === account.key),
      );

    return list.map(({ key }) => ({ label: key, value: key }));
  });

  const value = ref(editMint?.value.value ?? 0);
  const assetKey = ref(editMint?.value.asset.key ?? '');

  const asset = computed(() => assets.list.value.find(asset => asset.key === assetKey.value));
  const disabled = computed(() => !asset.value || !value.value);

  function clear() {
    value.value = editMint?.value.value ?? 0;
    assetKey.value = editMint?.value.asset.key ?? '';
  }

  function submit() {
    if (!asset.value) {
      assetEl.value?.focus();
      return;
    }

    if (!value.value) {
      valueEl.value?.focus();
      return;
    }

    if (value.value > MAX_VALUE) {
      valueEl.value?.focus();
      message.error('Value is too big');
      return;
    }

    if (!Number.isInteger(value.value)) {
      valueEl.value?.focus();
      message.error('Value must be integer');
      return;
    }

    if (editMint) {
      mints.update(editMint.value.key, {
        account,
        asset: asset.value as Asset,
        value: value.value,
      });
    } else {
      mints.create({
        account,
        asset: asset.value as Asset,
        value: value.value,
      });
    }

    show.value = false;
  }

  return {
    assetOptions,
    clear,
    submit,
    show,
    value,
    assetKey,
    MAX_VALUE,
    disabled,
  };
}
