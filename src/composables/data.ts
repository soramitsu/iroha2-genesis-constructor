import { ref } from 'vue';

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
  type: AssetType,
  key: string,
}

export type AssetBlank = {
  name: string,
  domain: string,
  type: AssetType,
}

export type Mint = {
  value: number,
  asset: Asset,
  account: Account,
  key: string,
}

export type MintBlank = {
  value: number,
  asset: Asset,
  account: Account,
}

const domains = ref<Domain[]>([]);
const activeDomainName = ref<string>('');
const accounts = ref<Account[]>([]);
const assets = ref<Asset[]>([]);
const mints = ref<Mint[]>([]);

function clearAll() {
  domains.value = [];
  activeDomainName.value = '';
  accounts.value = [];
  assets.value = [];
  mints.value = [];
}

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

  if (
    [AssetType.Quantity, AssetType.BigQuantity].includes(mint.asset.type) &&
    value.includes('.')
  ) return;

  if (isNaN(Number(value))) return;

  mint.value = Number(value);
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

// ---result---

function makeResultData() {
  const domainTransactions = domains.value.map(domain => ({
    Register: {
      object: {
        Raw: {
          Identifiable: {
            NewDomain: {
              id: {
                name: domain.name,
              },
              logo: null,
              metadata: {},
            },
          },
        },
      },
    },
  }));

  const accountTransactions = accounts.value.map(account => ({
    Register: {
      object: {
        Raw: {
          Identifiable: {
            NewAccount: {
              id: {
                name: account.name,
                domain_id: {
                  name: account.domain,
                },
              },
              signatories: account.signatories,
              metadata: {},
            },
          },
        },
      },
    },
  }));

  const assetTransactions = assets.value.map(asset => ({
    Register: {
      object: {
        Raw: {
          Identifiable: {
            NewAssetDefinition: {
              id: {
                name: asset.name,
                domain_id: {
                  name: asset.domain,
                },
              },
              value_type: asset.type,
              mintable: 'Infinitely',
              metadata: {},
            },
          },
        },
      },
    },
  }));

  const mintTransactions = mints.value.map(mint => ({
    Mint: {
      object: {
        Raw: {
          U32: mint.value,
        },
      },
      destination_id: {
        Raw: {
          Id: {
            AssetId: {
              definition_id: {
                name: mint.asset.name,
                domain_id: {
                  name: mint.asset.domain,
                },
              },
              account_id: {
                name: mint.account.name,
                domain_id: {
                  name: mint.account.domain,
                },
              },
            },
          },
        },
      },
    },
  }));

  return {
    transactions: [
      {
        isi: [
          ...domainTransactions,
          ...accountTransactions,
          ...assetTransactions,
          ...mintTransactions,
        ],
      },
    ],
  };
}

function handleJsonDomain(domain: any) {
  domains.value.push({
    name: domain.id.name,
  });
}

function handleJsonAccount(account: any) {
  accounts.value.push(makeAccount({
    name: account.id.name,
    domain: account.id.domain_id.name,
    signatories: account.signatories,
  }));
}

function handleJsonAsset(asset: any) {
  assets.value.push(makeAsset({
    name: asset.id.name,
    domain: asset.id.domain_id.name,
    type: asset.value_type,
  }));
}

function handleJsonMint(mint: any) {
  const asset = mint.destination_id.Raw.Id.AssetId.definition_id;
  const account = mint.destination_id.Raw.Id.AssetId.account_id;

  mints.value.push(makeMint({
    asset: makeAsset({
      name: asset.name,
      domain: asset.domain_id.name,
      type: AssetType.Quantity, // set true type after loop
    }),
    account: makeAccount({
      name: account.name,
      domain: account.domain_id.name,
    }),
    value: mint.object.Raw.U32,
  }));
}

function setValidAssetsForMints() {
  mints.value.forEach(mint => {
    const asset = assets.value.find(a => a.key === mint.asset.key);
    if (!asset) return;

    mint.asset = asset;
  });
}

function parseJsonData(data: any) {
  for (const item of data.transactions[0].isi) {
    if (item.Mint) {
      handleJsonMint(item.Mint);
      continue;
    }

    if (item.Register) {
      const { Identifiable } = item.Register.object.Raw;

      if (Identifiable.NewDomain) {
        handleJsonDomain(Identifiable.NewDomain);
        continue;
      }

      if (Identifiable.NewAccount) {
        handleJsonAccount(Identifiable.NewAccount);
        continue;
      }

      if (Identifiable.NewAssetDefinition) {
        handleJsonAsset(Identifiable.NewAssetDefinition);
        continue;
      }

      console.error('Unknown "item.Register.object.Raw.Identifiable"');
    }

    console.error('Unknown "isi" item');
  }

  setValidAssetsForMints();
}

export function useJsonData() {
  return {
    get: () => JSON.stringify(makeResultData(), null, 2),

    set: (json: string) => {
      const backup = {
        domains: domains.value,
        accounts: accounts.value,
        assets: assets.value,
        mints: mints.value,
        activeDomainName: activeDomainName.value,
      };

      try {
        clearAll();
        parseJsonData(JSON.parse(json));
        resetActiveDomain();
      } catch (e) {
        domains.value = backup.domains;
        accounts.value = backup.accounts;
        assets.value = backup.assets;
        mints.value = backup.mints;
        activeDomainName.value = backup.activeDomainName;

        throw e;
      }
    },
  };
}
