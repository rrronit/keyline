// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod core;
mod error;
mod handlers;
mod shortcut;

use crate::handlers::{close_window, handle_search, setup_window};
pub use core::*;
pub use error::AppError;
use tauri_plugin_global_shortcut::{Code, Modifiers};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let global_shortcut = shortcut::Shortcut::new();
    let global_shortcut_clone = global_shortcut.clone();

    tauri::Builder::default()
        .manage(SharedAppState::default())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler({
                    move |app, shortcut, event| {
                        global_shortcut.handle(app, shortcut, event);
                    }
                })
                .build(),
        )
        .setup(move |app: &mut tauri::App| {
            setup_window(app);
            global_shortcut_clone.register(app, Some(Modifiers::CONTROL), Code::Space)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![close_window, handle_search])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
