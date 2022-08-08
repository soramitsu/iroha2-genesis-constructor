#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod dto;

use iroha_core::genesis::RawGenesisBlock;


fn main() {
  // let genesis = RawGenesisBlock::from_path("./genesis.json").unwrap();
  
  // let transport = dto::TransportDto::from(genesis);
  // let block: RawGenesisBlock = transport.try_into().unwrap();

  // let json = serde_json::to_string(&block).unwrap();

  tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
