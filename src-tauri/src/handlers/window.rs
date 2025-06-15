use crate::core::app_state::SharedAppState;
use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize};

pub fn setup_window(app: &mut tauri::App) {
    let window = app.get_webview_window("main").unwrap();
    let monitor = window.current_monitor().unwrap().unwrap();
    let size = monitor.size();

    window
        .set_size(PhysicalSize::new(size.width, size.height))
        .unwrap();
    window.set_position(PhysicalPosition::new(0, 0)).unwrap();
}

#[tauri::command]
pub fn close_window(app: AppHandle) {
    let window = app.get_webview_window("main").unwrap();
    window.hide().unwrap();
    let app_state = app.try_state::<SharedAppState>();
    if let Some(app_state) = app_state {
        app_state.lock().unwrap().change_visible();
    }
}
