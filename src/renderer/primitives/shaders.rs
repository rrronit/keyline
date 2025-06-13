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

pub struct Shader {
    pub pipeline: wgpu::RenderPipeline,
}

impl Shader {
    pub fn new(context: &Context) -> Self {
        let shader = context
            .device
            .create_shader_module(wgpu::include_wgsl!("../shaders/shaders.wgsl"));

        let render_pipeline_layout =
            context
                .device
                .create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                    label: Some("Render Pipeline Layout"),
                    bind_group_layouts: &[],
                    push_constant_ranges: &[],
                });
        let render_pipeline = context
            .device
            .create_render_pipeline(&wgpu::RenderPipelineDescriptor {
                label: Some("Render Pipeline"),
                layout: Some(&render_pipeline_layout),
                vertex: wgpu::VertexState {
                module: &shader,
                entry_point: Some("vs_main"),
                buffers: &[],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            },
            fragment: Some(wgpu::FragmentState {
                module: &shader,
                entry_point: Some("fs_main"),
                targets: &[Some(wgpu::ColorTargetState {
                    format: context.config.format,
                    blend: Some(wgpu::BlendState::REPLACE),
                    write_mask: wgpu::ColorWrites::ALL,
                })],
                compilation_options: wgpu::PipelineCompilationOptions::default(),
            }),
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleList,
                strip_index_format: None,
                front_face: wgpu::FrontFace::Ccw,
                cull_mode: Some(wgpu::Face::Back),
                polygon_mode: wgpu::PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState {
                count: 1,
                mask: !0,
                alpha_to_coverage_enabled: false,
            },
            multiview: None,
            cache: None,
        });

        Self {
            pipeline: render_pipeline,
        }
    }
    pub fn draw(&self, pass: &mut wgpu::RenderPass) {
        pass.set_pipeline(&self.pipeline);
        pass.draw(0..3, 0..1); // 3.
    }
}
