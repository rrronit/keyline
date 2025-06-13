use keyline::app::KeylineApp;
use winit::event_loop::EventLoop;


fn main() {
    tracing_subscriber::fmt::init();

    let event_loop = EventLoop::new().unwrap();
    let mut app = KeylineApp::new();
    event_loop.run_app(&mut app).unwrap();
}
