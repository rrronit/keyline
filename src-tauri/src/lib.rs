// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod app;
mod error;
mod shortcut;

pub use app::AppState;
pub use error::AppError;
use tauri::{Manager, PhysicalPosition, PhysicalSize};

use std::sync::{Arc, Mutex};
use tauri_plugin_global_shortcut::{Code, Modifiers};

use crate::app::AppMode;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let global_shortcut = shortcut::Shortcut::new();
    let global_shortcut_clone = global_shortcut.clone();

    tauri::Builder::default()
        .manage(Mutex::new(AppState {
            query: String::new(),
            mode: AppMode::default(),
            visible: false,
        }))
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
            let window = app.get_webview_window("main").unwrap();
            let monitor = window.current_monitor().unwrap().unwrap();
            let size = monitor.size();

            window
                .set_size(PhysicalSize::new(size.width, size.height))
                .unwrap();
            window.set_position(PhysicalPosition::new(0, 0)).unwrap();
            window.set_focus().unwrap();
            global_shortcut_clone.register(app, Some(Modifiers::CONTROL), Code::Space)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![close_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn close_window(app: tauri::AppHandle) {
    let window = app.get_webview_window("main").unwrap();
    window.hide().unwrap();
    let app_state = app.state::<Mutex<AppState>>();
    app_state.lock().unwrap().change_visible();
    println!("closing window");
}
