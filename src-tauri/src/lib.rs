#[cfg_attr(mobile, tauri::mobile_entry_point)]

mod commands;

use commands::{backup_to_documents, get_backup_path};

pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
        if cfg!(debug_assertions) {
          app.handle().plugin(
            tauri_plugin_log::Builder::default()
              .level(log::LevelFilter::Info)
              .build(),
          )?;
        }
        app.handle().plugin(tauri_plugin_fs::init())?;
        app.handle().plugin(tauri_plugin_os::init())?;
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![backup_to_documents, get_backup_path])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}