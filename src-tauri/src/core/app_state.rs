use std::sync::Mutex;
use serde::{Deserialize, Serialize};

#[derive(Default, Clone, Copy, Serialize, Deserialize)]
pub enum AppMode {
    #[default]
    Normal,
    Command,
    Search,
}

#[derive(Default)]
pub struct AppState {
    pub query: String,
    pub mode: AppMode,
    pub visible: bool,
}

impl AppState {
    pub fn change_visible(&mut self) {
        self.visible = !self.visible;
    }
}

pub type SharedAppState = Mutex<AppState>;
