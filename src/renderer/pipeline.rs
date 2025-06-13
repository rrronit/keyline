use std::collections::HashMap;

use wgpu::PipelineCompilationOptions;

pub struct PipelineOptions<'a> {
    pub vertex_shader: &'a str,
    pub fragment_shader: &'a str,
    pub blend: Option<wgpu::BlendState>,
    pub primitive: wgpu::PrimitiveState,
    pub label: Option<&'a str>,
}

pub fn build_pipeline(
    device: &wgpu::Device,
    layout: &wgpu::PipelineLayout,
    format: wgpu::TextureFormat,
    opts: PipelineOptions,
) -> wgpu::RenderPipeline {
    let vs = device.create_shader_module(wgpu::ShaderModuleDescriptor {
        label: Some("Vertex Shader"),
        source: wgpu::ShaderSource::Wgsl(opts.vertex_shader.into()),
    });
    let fs = device.create_shader_module(wgpu::ShaderModuleDescriptor {
        label: Some("Fragment Shader"),
        source: wgpu::ShaderSource::Wgsl(opts.fragment_shader.into()),
    });

    device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
        cache: None,
        label: opts.label,
        layout: Some(layout),
        vertex: wgpu::VertexState {
            module: &vs,
            entry_point: Some("vs_main"),
            buffers: &[],
            compilation_options: PipelineCompilationOptions::default(),
        },
        fragment: Some(wgpu::FragmentState {
            module: &fs,
            entry_point: Some("fs_main"),
            targets: &[Some(wgpu::ColorTargetState {
                format,
                blend: opts.blend,
                write_mask: wgpu::ColorWrites::ALL,
            })],
            compilation_options: PipelineCompilationOptions::default(),
        }),
        primitive: opts.primitive,
        depth_stencil: None,
        multisample: wgpu::MultisampleState::default(),
        multiview: None,
    })
}

pub struct PipelineCache {
    pipelines: HashMap<String, wgpu::RenderPipeline>,
}

impl PipelineCache {
    pub fn new() -> Self {
        Self {
            pipelines: HashMap::new(),
        }
    }

    pub fn get_or_create(
        &mut self,
        key: &str,
        device: &wgpu::Device,
        layout: &wgpu::PipelineLayout,
        format: wgpu::TextureFormat,
        opts: PipelineOptions,
    ) -> &wgpu::RenderPipeline {
        self.pipelines
            .entry(key.to_string())
            .or_insert_with(|| build_pipeline(device, layout, format, opts))
    }
}
