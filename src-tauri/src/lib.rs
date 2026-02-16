#[cfg_attr(mobile, tauri::mobile_entry_point)]

mod commands;

use commands::{
    backup_to_documents,
    get_backup_path,
    get_all_entries,
    get_entry,
    save_entry,
    update_entry,
    delete_entry,
    save_image,
    get_storage_path,
    import_entries,
    init_app_state,
    AppState,
};

pub fn run() {
  tauri::Builder::default()
    .manage(AppState {
        entries: std::sync::Mutex::new(Vec::new()),
    })
    .setup(|app| {
        let handle = app.handle().clone();

        // Initialize app state with existing entries
        tauri::async_runtime::spawn(async move {
            let _ = init_app_state(handle.state::<AppState>());
        });

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
    .invoke_handler(tauri::generate_handler![
        backup_to_documents,
        get_backup_path,
        get_all_entries,
        get_entry,
        save_entry,
        update_entry,
        delete_entry,
        save_image,
        get_storage_path,
        import_entries,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}