#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod dto;
mod utils;

use std::{fs, path::Path};

use dto::{BlockDto, SaveGenesisRequestDto};
use iroha_core::genesis::RawGenesisBlock;

#[tauri::command]
fn open_genesis(path: String) -> Option<BlockDto> {
  let genesis = RawGenesisBlock::from_path(path).ok()?;
  let block = BlockDto::from(genesis);
  Some(block)
}

#[tauri::command]
fn save_genesis(dto: SaveGenesisRequestDto) -> Option<bool> {
  let path = Path::new(&dto.dir);

  let genesis: RawGenesisBlock = dto.block.try_into().ok()?;
  let json = serde_json::to_string_pretty(&genesis).ok()?;
  fs::write(path.join("genesis.json"), json).ok()?;

  let keys_path = path.join("keys");
  let _ = fs::create_dir(&keys_path);

  dto.private_keys.iter().for_each(|pk| {
    let _ = fs::write(keys_path.join(&pk.name), &pk.key);
  });

  Some(true)
}

#[tauri::command]
fn make_genesis(block: BlockDto) -> Option<String> {
  let genesis: RawGenesisBlock = block.try_into().ok()?;
  let json = serde_json::to_string(&genesis).ok()?;

  Some(json)
}

#[tauri::command]
fn validate_value(value: String, value_type: String) -> bool {
  utils::validate_value(value, value_type)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      open_genesis,
      save_genesis,
      make_genesis,
      validate_value,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
