use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AppMode {
    Search,
    Result,
    Settings,
}

impl Default for AppMode {
    fn default() -> Self {
        Self::Search
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppState {
    pub query: String,
    pub mode: AppMode,
    pub visible: bool,
    
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            query: String::new(),
            mode: AppMode::default(),
            visible: false,
        }
    }
}

impl AppState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn reset(&mut self) {
        self.query = String::new();
        self.mode = AppMode::Search;
    }

    pub fn set_query(&mut self, query: String) {
        self.query = query;
    }

    pub fn set_mode(&mut self, mode: AppMode) {
        self.mode = mode;
    }

    pub fn query(&self) -> &str {
        &self.query
    }

    pub fn mode(&self) -> &AppMode {
        &self.mode
    }
    pub fn change_visible(&mut self) {
        self.visible = !self.visible;
    }
} 