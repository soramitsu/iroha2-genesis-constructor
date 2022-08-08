use std::str::FromStr;

use iroha_core::{
    tx::{
        MintBox, Expression, Instruction, Domain, AccountId, 
        Account, AssetDefinition, AssetDefinitionId, Fixed, 
        Metadata, ExpressionBox, AssetId, RegisterBox
    }, 
    genesis::{RawGenesisBlock, GenesisTransaction},
    prelude::PublicKey
};

use iroha_data_model::{
    Identifiable, 
    domain::NewDomain, 
    account::NewAccount, 
    asset::{ NewAssetDefinition, AssetValueType }, 
    Value, 
    IdBox, IdentifiableBox, small::{SmallVec, smallvec},
};

use serde::{Serialize, Deserialize};

fn asset_type_to_string(t: AssetValueType) -> String {
    let str = match t {
        AssetValueType::Quantity => "Quantity",
        AssetValueType::Fixed => "Fixed",
        AssetValueType::BigQuantity => "BigQuantity",
        AssetValueType::Store => "Store",
    };

    str.to_string()
}

fn asset_type_from_string(string: String) -> AssetValueType {
    match string.as_str() {
        "Fixed" => AssetValueType::Fixed,
        "BigQuantity" => AssetValueType::BigQuantity,
        "Store" => AssetValueType::Store,
        _ => AssetValueType::Quantity,
    }
}

#[inline]
fn parse_string<T>(s: String) -> Result<T, ()> where T: FromStr {
    s.parse::<T>().map_err(|_| ())
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DomainDto {
    name: String,
}

impl From<NewDomain> for DomainDto {
    fn from(domain: NewDomain) -> Self {
        Self { 
            name: domain.id().name.to_string(),
        }
    }
}

impl TryInto<NewDomain> for DomainDto {
    type Error = ();

    fn try_into(self) -> Result<NewDomain, ()> {
        Ok(Domain::new(parse_string(self.name)?))
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AccountDto {
    name: String,
    domain: String,
    signatories: Vec<String>,
    key: String,
}

impl From<NewAccount> for AccountDto {
    fn from(account: NewAccount) -> Self {
        let id = account.id();
        let name = id.name.to_string();
        let domain = id.domain_id.name.to_string();
        let key = format!("{}@{}", name, domain);
        let signatories = account.build().signatories().map(|s| s.to_string()).collect::<Vec<String>>();

        Self { name, domain, key, signatories }
    }
}

impl TryInto<NewAccount> for AccountDto {
    type Error = ();

    fn try_into(self) -> Result<NewAccount, ()> {
        let id: AccountId = parse_string(self.key)?;

        let signatories = self.signatories.iter().fold(Vec::new(), |mut acc, s| {
            match PublicKey::from_str(s) {
                Ok(key) => { acc.push(key); acc },
                Err(_) => acc,
            }
        });

        if signatories.len() != self.signatories.len() {
            return Err(())
        }

        Ok(Account::new(id, signatories))
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AssetDto {
    name: String,
    domain: String,
    value_type: String,
    key: String,
}

impl From<NewAssetDefinition> for AssetDto {
    fn from(asset: NewAssetDefinition) -> Self {
        let id = asset.id();
        let name = id.name.to_string();
        let domain = id.domain_id.name.to_string();
        let key = format!("{}#{}", name, domain);
        let value_type = asset_type_to_string(*asset.build().value_type());

        Self { name, domain, value_type, key }
    }
}

impl TryInto<NewAssetDefinition> for AssetDto {
    type Error = ();

    fn try_into(self) -> Result<NewAssetDefinition, ()> {
        let id: AssetDefinitionId = parse_string(self.key)?;

        let definition = match asset_type_from_string(self.value_type) {
            AssetValueType::Quantity => AssetDefinition::quantity(id),
            AssetValueType::BigQuantity => AssetDefinition::big_quantity(id),
            AssetValueType::Fixed => AssetDefinition::fixed(id),
            AssetValueType::Store => AssetDefinition::store(id),
        };

        Ok(definition)
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct MintDto {
    value: String,
    asset: AssetDto,
    account: AccountDto,
    key: String,
}

impl TryFrom<MintBox> for MintDto {
    type Error = ();

    fn try_from(mint: MintBox) -> Result<MintDto, ()> {
        let value: String;
        let value_type: String;

        match *mint.object.expression {
            Expression::Raw(v) => match *v {
                Value::U32(x) => {
                    value = x.to_string();
                    value_type = asset_type_to_string(AssetValueType::Quantity);
                } ,
                Value::U128(x) => {
                    value = x.to_string();
                    value_type = "BigQuantity".to_string();
                },
                Value::Fixed(x) => {
                    value = x.to_string();
                    value_type = "Fixed".to_string();
                },
                Value::LimitedMetadata(_) => {
                    value = "Not implemented".to_string();
                    value_type = "Store".to_string();
                },
                _ => return Err(()),
            },
            _ => return Err(()),
        };

        let asset: AssetDto;
        let account: AccountDto;
        let mint_key: String;

        match *mint.destination_id.expression {
            Expression::Raw(v) => match *v {
                Value::Id(id) => match id {
                    IdBox::AssetId(aid) => {
                        let asset_name = aid.definition_id.name.to_string();
                        let asset_domain = aid.definition_id.domain_id.name.to_string();
                        let asset_key = format!("{}#{}", asset_name, asset_domain);

                        let account_name = aid.account_id.name.to_string();
                        let account_domain = aid.account_id.domain_id.name.to_string();
                        let account_key = format!("{}@{}", account_name, account_domain);

                        mint_key = format!("{}>{}", asset_key, account_key);

                        asset = AssetDto {
                            name: asset_name,
                            domain: asset_domain,
                            key: asset_key,
                            value_type,
                        };

                        account = AccountDto {
                            name: account_name,
                            domain: account_domain,
                            key: account_key,
                            signatories: Vec::new(), // it doesn't matter if there is one
                        };
                    },
                    _ => return Err(()),
                },
                _ => return Err(()),
            },
            _ => return Err(()),
        };

        Ok(MintDto {
            value,
            asset,
            account,
            key: mint_key,
        })

    }
}

impl TryInto<MintBox> for MintDto {
    type Error = ();

    fn try_into(self) -> Result<MintBox, ()> {
        let value = match asset_type_from_string(self.asset.value_type) {
            AssetValueType::Quantity => Value::U32(parse_string(self.value)?),
            AssetValueType::BigQuantity => Value::U128(parse_string(self.value)?),
            AssetValueType::Fixed => {
                let f = parse_string::<f64>(self.value)?;
                Value::Fixed(Fixed::try_from(f).map_err(|_| ())?)
            },
            AssetValueType::Store => Value::LimitedMetadata(Metadata::new()),
        };

        let object = ExpressionBox::from(value);
        let definition_id: AssetDefinitionId = parse_string(self.asset.key)?;
        let account_id: AccountId = parse_string(self.account.key)?;
        let asset_id = AssetId::new(definition_id, account_id);
        let destination_id = IdBox::AssetId(asset_id);

        Ok(MintBox::new(object, destination_id))
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TransportDto {
    domains: Vec<DomainDto>,
    accounts: Vec<AccountDto>,
    assets: Vec<AssetDto>,
    mints: Vec<MintDto>
}

impl From<RawGenesisBlock> for TransportDto {
    fn from(block: RawGenesisBlock) -> Self {
        let mut transport = TransportDto {
            domains: Vec::new(),
            accounts: Vec::new(),
            assets: Vec::new(),
            mints: Vec::new(),
        };

        for tx in block.transactions {
            for instruction in tx.isi {
                match instruction {
                    Instruction::Mint(mint) => {
                        match MintDto::try_from(mint) {
                            Ok(dto) => transport.mints.push(dto),
                            Err(_) => (),
                        }
                    },
                    Instruction::Register(regbox) => match *regbox.object.expression {
                            Expression::Raw(v) => match *v {
                                Value::Identifiable(i) => match i {
                                    IdentifiableBox::NewDomain(domain) => {
                                        let dto = DomainDto::from(*domain);
                                        transport.domains.push(dto)
                                    },
                                    IdentifiableBox::NewAccount(account) => {
                                        let dto = AccountDto::from(*account);
                                        transport.accounts.push(dto);
                                    },
                                    IdentifiableBox::NewAssetDefinition(asset) => {
                                        let dto = AssetDto::from(*asset);
                                        transport.assets.push(dto);
                                    },
                                    _ => (),
                                },
                                _ => (),
                            },
                            _ => (),
                        },
                    _ => (),
                }
            };
        };

        transport
    }
}

impl TryInto<RawGenesisBlock> for TransportDto {
    type Error = ();

    fn try_into(self) -> Result<RawGenesisBlock, ()> {
        let mut isi = SmallVec::new();

        for d in self.domains {
            let domain: NewDomain = d.try_into()?;
            let value = Value::try_from(domain).map_err(|_| ())?;
            let regbox = RegisterBox::new(value);
            isi.push(Instruction::Register(regbox));
        };

        for a in self.accounts {
            let account: NewAccount = a.try_into()?;
            let value = Value::try_from(account).map_err(|_| ())?;
            let regbox = RegisterBox::new(value);
            isi.push(Instruction::Register(regbox));
        };

        for a in self.assets {
            let asset: NewAssetDefinition = a.try_into()?;
            let value = Value::try_from(asset).map_err(|_| ())?;
            let regbox = RegisterBox::new(value);
            isi.push(Instruction::Register(regbox));
        };

        for m in self.mints {
            let mint: MintBox = m.try_into()?;
            isi.push(Instruction::Mint(mint));
        };

        let block = RawGenesisBlock {
            transactions: SmallVec(smallvec![GenesisTransaction { isi }]),
        };

        Ok(block)
    }

}