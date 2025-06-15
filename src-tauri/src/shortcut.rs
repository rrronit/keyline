use std::sync::Mutex;

use tauri::{App, Emitter, Manager};
use tauri_plugin_global_shortcut::{
    Code, GlobalShortcutExt, Modifiers, ShortcutEvent, ShortcutState,
};

use crate::{error::AppResult, SharedAppState};

#[derive(Clone)]
pub struct Shortcut;

impl Shortcut {
    pub fn new() -> Self {
        Self
    }

    pub fn register(&self, app: &App, mods: Option<Modifiers>, key: Code) -> AppResult<()> {
        let shortcut = tauri_plugin_global_shortcut::Shortcut::new(mods, key);
        app.global_shortcut()
            .register(shortcut)
            .map_err(|e| crate::error::AppError::Shortcut(e))?;
        Ok(())
    }

    pub fn _unregister(&self, app: &App, mods: Option<Modifiers>, key: Code) -> AppResult<()> {
        let shortcut = tauri_plugin_global_shortcut::Shortcut::new(mods, key);
        app.global_shortcut()
            .unregister(shortcut)
            .map_err(|e| crate::error::AppError::Shortcut(e))?;
        Ok(())
    }

    pub fn handle(
        &self,
        app: &tauri::AppHandle,
        shortcut: &tauri_plugin_global_shortcut::Shortcut,
        event: ShortcutEvent,
    ) {
        if event.state != ShortcutState::Pressed {
            return;
        }

        match (shortcut.mods, shortcut.key) {
            // (_, Code::Escape) => {
            //     if let Err(e) = self.handle_escape(app) {
            //         eprintln!("Error handling escape: {:?}", e);
            //     }
            // }
            (Modifiers::CONTROL, Code::Space) => {
                if let Err(e) = self.handle_ctrl_space(app) {
                    eprintln!("Error handling ctrl+space: {:?}", e);
                }
            }
            _ => {}
        }
    }

    // fn handle_escape(&self, app: &tauri::AppHandle) -> AppResult<()> {
    //     let window = app
    //         .get_webview_window("main")
    //         .ok_or_else(|| crate::error::AppError::Window("Main window not found".into()))?;
    //     let app_state = app.try_state::<Mutex<AppState>>();
    //     if let Some(app_state) = app_state {
    //         if app_state.lock().unwrap().visible {
    //             window
    //                 .hide()
    //                 .map_err(|e| crate::error::AppError::Window(e.to_string()))?;

    //             app_state.lock().unwrap().change_visible();
    //         }
    //     }
    //     Ok(())
    // }

    fn handle_ctrl_space(&self, app: &tauri::AppHandle) -> AppResult<()> {
        let window = app
            .get_webview_window("main")
            .ok_or_else(|| crate::error::AppError::Window("Main window not found".into()))?;
        let app_state = app.try_state::<SharedAppState>();
        if let Some(app_state) = app_state {
            if app_state.lock().unwrap().visible {
                app.emit("close-window", "").unwrap();
                window
                    .hide()
                    .map_err(|e| crate::error::AppError::Window(e.to_string()))?;
            } else {
                app.emit("open-window", "").unwrap();

                window
                    .show()
                    .map_err(|e| crate::error::AppError::Window(e.to_string()))?;
                window
                    .set_focus()
                    .map_err(|e| crate::error::AppError::Window(e.to_string()))?;
                window
                    .unminimize()
                    .map_err(|e| crate::error::AppError::Window(e.to_string()))?;
            }
            app_state.lock().unwrap().change_visible();
        }
        Ok(())
    }
}
