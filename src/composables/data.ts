/* eslint-disable camelcase */
import { ref } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import { writeText } from '@tauri-apps/api/clipboard';
import { choiseDir, choiseFile } from '@/lib/file';

export type Domain = {
  name: string,
}

export type Account = {
  name: string,
  domain: string,
  signatories: string[],
  key: string,
}

export type AccountBlank = {
  name: string,
  domain: string,
  signatories?: string[],
}

export const enum AssetType {
  Quantity = 'Quantity',
  BigQuantity = 'BigQuantity',
  Fixed = 'Fixed',
  Store = 'Store',
}

export type Asset = {
  name: string,
  domain: string,
  value_type: AssetType,
  key: string,
}

export type AssetBlank = {
  name: string,
  domain: string,
  value_type: AssetType,
}

export type Mint = {
  value: string,
  asset: Asset,
  account: Account,
  key: string,
}

export type MintBlank = {
  value: string,
  asset: Asset,
  account: Account,
}

export type PrivateKey = {
  key: string,
  name: string,
}

export type GenesisBlock = {
  domains: Domain[],
  accounts: Account[],
  assets: Asset[],
  mints: Mint[],
}

export type SaveGenesisRequest = {
  dir: string,
  private_keys: PrivateKey[],
  block: GenesisBlock,
}

const domains = ref<Domain[]>([]);
const activeDomainName = ref<string>('');
const accounts = ref<Account[]>([]);
const assets = ref<Asset[]>([]);
const mints = ref<Mint[]>([]);
const privateKeys = ref<PrivateKey[]>([]);

function resetActiveDomain() {
  if (domains.value.length) {
    activeDomainName.value = domains.value[0].name;
  } else {
    activeDomainName.value = '';
  }
}

// ---domains---

function createDomain(domain: Domain) {
  domains.value.push(domain);
}

function removeDomain(name: string) {
  domains.value = domains.value.filter(d => d.name !== name);
  accounts.value = accounts.value.filter(a => a.domain !== name);
  assets.value = assets.value.filter(a => a.domain !== name);
  mints.value = mints.value.filter(m => m.asset.domain !== name && m.account.domain !== name);
  resetActiveDomain();
}

export function useDomains() {
  return {
    list: domains,
    active: activeDomainName,
    create: createDomain,
    remove: removeDomain,
  };
}

// ---accounts---

function makeAccount(blank: AccountBlank): Account {
  return {
    ...blank,
    key: `${blank.name}@${blank.domain}`,
    signatories: blank.signatories ?? [],
  };
}

function createAccount(blank: AccountBlank) {
  accounts.value.push(makeAccount(blank));
}

function removeAccount(key: string) {
  accounts.value = accounts.value.filter(a => a.key !== key);
  mints.value = mints.value.filter(m => m.account.key !== key);
}

function filterAccounts(domain: string) {
  return accounts.value.filter(a => a.domain === domain);
}

export function useAccounts() {
  return {
    list: accounts,
    filter: filterAccounts,
    create: createAccount,
    remove: removeAccount,
  };
}

// ---assets---

function makeAsset(blank: AssetBlank): Asset {
  return {
    ...blank,
    key: `${blank.name}#${blank.domain}`,
  };
}

function createAsset(blank: AssetBlank) {
  assets.value.push(makeAsset(blank));
}

function removeAsset(key: string) {
  assets.value = assets.value.filter(a => a.key !== key);
  mints.value = mints.value.filter(m => m.asset.key !== key);
}

function filterAssets(domain: string) {
  return assets.value.filter(a => a.domain === domain);
}

export function useAssets() {
  return {
    list: assets,
    filter: filterAssets,
    create: createAsset,
    remove: removeAsset,
  };
}

// ---mints---

function makeMint(blank: MintBlank): Mint {
  return {
    ...blank,
    key: `${blank.account.key}>${blank.asset.key}`,
  };
}

function createMint(blank: MintBlank) {
  mints.value.push(makeMint(blank));
}

function setMintValue(key: string, value: string) {
  const mint = mints.value.find(m => m.key === key);
  if (!mint) return;

  mint.value = value;
}

function removeMint(key: string) {
  mints.value = mints.value.filter(m => m.key !== key);
}

export function useMints() {
  return {
    list: mints,
    create: createMint,
    remove: removeMint,
    setValue: setMintValue,
  };
}

// ---private keys ---

function addPrivateKey(blank: PrivateKey) {
  privateKeys.value?.push(blank);
}

export function usePrivateKeys() {
  return {
    add: addPrivateKey,
  };
}

// ---data---

export const enum CommandStatus {
  Done = 'done',
  Сanceled = 'canceled',
  Failed = 'failed',
}

async function saveGenesis(): Promise<CommandStatus> {
  const dir = await choiseDir();
  if (!dir) return CommandStatus.Сanceled;

  const dto: SaveGenesisRequest = {
    dir,
    private_keys: privateKeys.value,
    block: {
      domains: domains.value,
      accounts: accounts.value,
      assets: assets.value,
      mints: mints.value,
    },
  };

  const res = await invoke('save_genesis', { dto });
  return res ? CommandStatus.Done : CommandStatus.Failed;
}

async function openGenesis(): Promise<CommandStatus> {
  const path = await choiseFile();
  if (!path) return CommandStatus.Сanceled;

  const block = await invoke<GenesisBlock>('open_genesis', { path });

  if (!block) {
    return CommandStatus.Failed;
  }

  domains.value = block.domains;
  accounts.value = block.accounts;
  assets.value = block.assets;
  mints.value = block.mints;
  privateKeys.value = [];

  resetActiveDomain();

  return CommandStatus.Done;
}

async function copyGenesis(): Promise<CommandStatus> {
  const json = await invoke<string>('make_genesis', {
    block: {
      domains: domains.value,
      accounts: accounts.value,
      assets: assets.value,
      mints: mints.value,
    },
  });

  if (!json) return CommandStatus.Failed;

  await writeText(json);

  return CommandStatus.Done;
}

function clearAll(): void {
  domains.value = [];
  accounts.value = [];
  assets.value = [];
  mints.value = [];
  privateKeys.value = [];
  activeDomainName.value = '';
}

export function useData() {
  return {
    open: openGenesis,
    save: saveGenesis,
    copy: copyGenesis,
    clear: clearAll,
  };
}
