use std::str::FromStr;

use iroha_core::tx::{AssetValueType, Fixed};

pub fn asset_type_to_string(t: AssetValueType) -> String {
    let str = match t {
        AssetValueType::Quantity => "Quantity",
        AssetValueType::Fixed => "Fixed",
        AssetValueType::BigQuantity => "BigQuantity",
        AssetValueType::Store => "Store",
    };

    str.to_string()
}

pub fn asset_type_from_string(string: String) -> AssetValueType {
    match string.as_str() {
        "Fixed" => AssetValueType::Fixed,
        "BigQuantity" => AssetValueType::BigQuantity,
        "Store" => AssetValueType::Store,
        _ => AssetValueType::Quantity,
    }
}

#[inline]
pub fn parse_string<T>(s: String) -> Result<T, ()> where T: FromStr {
    s.parse::<T>().map_err(|_| ())
}

pub fn validate_value(value: String, value_type: String) -> bool {
    let value_type = asset_type_from_string(value_type);
    
    match value_type {
        AssetValueType::Quantity => value.parse::<u32>().is_ok(),
        AssetValueType::BigQuantity => value.parse::<u128>().is_ok(),
        AssetValueType::Fixed => {
            let f = match value.parse::<f64>() {
                Ok(f) => f,
                Err(_) => return false,
            };

            Fixed::try_from(f).is_ok()
        },
        AssetValueType::Store => true, // not yet implemented
    }
}