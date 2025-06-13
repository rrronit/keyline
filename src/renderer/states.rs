use std::sync::Arc;

use crate::renderer::{context::{Context, ContextError}, pipeline::PipelineCache, primitives::rect::Rect};

pub struct GPUState {
    pub context: Context,
    pub pipeline_cache: PipelineCache,
}

impl GPUState {
    pub async fn new(window: Arc<winit::window::Window>) -> Result<Self, ContextError> {
        let context = Context::new(window).await?;

        Ok(Self {
            context,
            pipeline_cache: PipelineCache::new(),
        })
    }

    pub fn render(&mut self) {
        let frame = self.context.surface.get_current_texture().unwrap();
        let view = frame.texture.create_view(&Default::default());

        let mut encoder =
            self.context
                .device
                .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                    label: Some("Render Encoder"),
                });

        {
            let pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: Some("Main Pass"),
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Clear(wgpu::Color::BLACK),
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: None,
                occlusion_query_set: None,
                timestamp_writes: None,
            });
        }

        self.context.queue.submit(Some(encoder.finish()));
        frame.present();
    }
}
