// app.rs
use std::sync::Arc;

use winit::{
    dpi::{PhysicalPosition, PhysicalSize, Position, Size},
    event::{KeyEvent, WindowEvent},
    event_loop::ActiveEventLoop,
    keyboard::PhysicalKey,
    window::{Window, WindowAttributes},
};

use crate::{
    input::keyboard,
    renderer::{context::Context, renderer::Renderer},
};

pub struct KeylineApp {
    context: Option<Context>,
}

impl KeylineApp {
    pub fn new() -> Self {
        Self { context: None }
    }
    pub fn create_window(&self, event_loop: &ActiveEventLoop) -> Option<Window> {
        let mut window_attributes = WindowAttributes::default();

        window_attributes.decorations = false;
        window_attributes.blur = true;
        window_attributes.visible = false;
        window_attributes.transparent = true;

        if let Some(monitor) = event_loop.primary_monitor() {
            let screen_size = monitor.size();

            let window_width = screen_size.width / 2;
            let window_height = 300;
            window_attributes.inner_size = Some(Size::Physical(PhysicalSize::new(
                window_width,
                window_height,
            )));

            let x = (screen_size.width.saturating_sub(window_width)) / 2;
            let y = (screen_size.height.saturating_sub(window_height)) / 2 - 150;

            window_attributes.position = Some(Position::Physical(PhysicalPosition::new(
                x as i32, y as i32,
            )));
        }

        match event_loop.create_window(window_attributes) {
            Ok(window) => Some(window),
            Err(e) => {
                eprintln!("Failed to create window: {e}");
                None
            }
        }
    }
}

impl winit::application::ApplicationHandler for KeylineApp {
    fn resumed(&mut self, event_loop: &ActiveEventLoop) {
        let Some(window) = self.create_window(event_loop) else {
            eprintln!("Failed to create window");
            return;
        };
        let window = Arc::new(window);

        let context = pollster::block_on(Context::new(window.clone()));
        if let Ok(context) = context {
            window.set_visible(true);
            self.context = Some(context);
        }
    }

    fn window_event(
        &mut self,
        event_loop: &ActiveEventLoop,
        _window_id: winit::window::WindowId,
        event: WindowEvent,
    ) {
        let _context = match &mut self.context {
            Some(context) => context,
            None => return,
        };

        match event {
            WindowEvent::KeyboardInput {
                event:
                    KeyEvent {
                        physical_key: PhysicalKey::Code(code),
                        state: key_state,
                        ..
                    },
                ..
            } => keyboard::handle_key(event_loop, code, key_state.is_pressed()),
            WindowEvent::RedrawRequested => {
                let context = self.context.as_ref().unwrap();
                let renderer = Renderer::new(context);
                renderer.render(context);
            }
            _ => {}
        }
    }
}
