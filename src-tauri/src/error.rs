use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Tauri error: {0}")]
    Tauri(#[from] tauri::Error),
    
    #[error("Shortcut error: {0}")]
    Shortcut(#[from] tauri_plugin_global_shortcut::Error),
    
    #[error("Window error: {0}")]
    Window(String),
    
    #[error("State error: {0}")]
    State(String),
}

pub type AppResult<T> = Result<T, AppError>; 