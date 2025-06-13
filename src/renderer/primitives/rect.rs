use wgpu::{PipelineCompilationOptions, util::DeviceExt};

use crate::renderer::{context::Context, draw_pass::Drawable};
#[repr(C)]
#[derive(Copy, Clone, Debug)]
struct RectVertex {
    position: [f32; 2],
    color: [f32; 4],
}

unsafe impl bytemuck::Pod for RectVertex {}
unsafe impl bytemuck::Zeroable for RectVertex {}

impl RectVertex {
    pub fn new(position: [f32; 2], color: [f32; 4]) -> Self {
        Self { position, color }
    }

    pub fn create_vertices<'a>(positions: &'a [[f32; 2]], colors: &'a [[f32; 4]]) -> Vec<Self> {
        positions
            .iter()
            .zip(colors.iter())
            .map(|(&pos, &col)| Self::new(pos, col))
            .collect()
    }
}

pub struct Rect {
    // Placeholder — add vertex buffers, pipeline, etc. for when we have a pipeline cache
    pub pipeline: wgpu::RenderPipeline,
    pub vertex_buffer: wgpu::Buffer,
}

impl Rect {
    pub fn new(context: &Context, vertices: &[RectVertex]) -> Self {
        let shader = wgpu::ShaderSource::Wgsl(include_str!("../shaders/rect.wgsl").into());
        let shader_module = context
            .device
            .create_shader_module(wgpu::ShaderModuleDescriptor {
                label: Some("Rect Shader Module"),
                source: shader,
            });

        let pipeline_layout =
            context
                .device
                .create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                    label: Some("Rect Pipeline Layout"),
                    bind_group_layouts: &[],
                    push_constant_ranges: &[],
                });
        let pipeline = context
            .device
            .create_render_pipeline(&wgpu::RenderPipelineDescriptor {
                label: Some("Rect Pipeline"),
                layout: Some(&pipeline_layout),
                vertex: wgpu::VertexState {
                    module: &shader_module,
                    entry_point: Some("vs_main"),
                    buffers: &[],
                    compilation_options: PipelineCompilationOptions::default(),
                },
                fragment: None,
                primitive: wgpu::PrimitiveState {
                    front_face: wgpu::FrontFace::Ccw,
                    cull_mode: Some(wgpu::Face::Back),
                    ..Default::default()
                },
                depth_stencil: None,
                multisample: wgpu::MultisampleState {
                    count: 1,
                    mask: 0xFFFFFFFF,
                    ..Default::default()
                },
                multiview: None,
                cache: Some(&context.pipeline_cache),
            });

        let vertex_buffer = context
            .device
            .create_buffer_init(&wgpu::util::BufferInitDescriptor {
                label: Some("Vertex Buffer"),
                contents: bytemuck::cast_slice(vertices),
                usage: wgpu::BufferUsages::VERTEX,
            });

        Self {
            pipeline,
            vertex_buffer,
        }
    }
}

impl Drawable for Rect {
    fn draw(&self, pass: &mut wgpu::RenderPass) {
        pass.set_pipeline(&self.pipeline);
        pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
        pass.draw(0..6, 0..1);
    }
}
