use winit::{event_loop::ActiveEventLoop, keyboard::KeyCode};

pub fn handle_key(_event_loop: &ActiveEventLoop, code: KeyCode, pressed: bool) {
    match code {
        KeyCode::Escape => {
            if pressed {
                _event_loop.exit();
            }
        }
        _ => {}
    }
}
