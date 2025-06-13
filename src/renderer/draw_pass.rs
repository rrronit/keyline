pub trait Drawable {
    fn draw(&self, pass: &mut wgpu::RenderPass);
}
