use std::sync::Arc;

use winit::window::Window;

use wgpu::{PipelineCache, SurfaceConfiguration};

#[derive(Debug)]
pub enum ContextError {
    CreateSurface(wgpu::CreateSurfaceError),
    RequestDevice(wgpu::RequestDeviceError),
}

impl From<wgpu::CreateSurfaceError> for ContextError {
    fn from(err: wgpu::CreateSurfaceError) -> Self {
        Self::CreateSurface(err)
    }
}

impl From<wgpu::RequestDeviceError> for ContextError {
    fn from(err: wgpu::RequestDeviceError) -> Self {
        Self::RequestDevice(err)
    }
}

pub struct Context {
    pub device: wgpu::Device,
    pub queue: wgpu::Queue,
    pub surface: wgpu::Surface<'static>,
    pub config: SurfaceConfiguration,
    pub pipeline_cache: PipelineCache,
}

impl Context {
    pub async fn new(window: Arc<Window>) -> Result<Self, ContextError> {
        let instance = wgpu::Instance::default();
        let surface = instance.create_surface(window.clone())?;
        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                compatible_surface: Some(&surface),
                ..Default::default()
            })
            .await
            .unwrap();

        let (device, queue) = adapter
            .request_device(&wgpu::DeviceDescriptor {
                label: Some("Device"),
                required_features: wgpu::Features::PIPELINE_CACHE,
                ..Default::default()
            })
            .await?;
        let size = &window.inner_size();
        let surface_caps = surface.get_capabilities(&adapter);

        let config = wgpu::SurfaceConfiguration {
            usage: wgpu::TextureUsages::RENDER_ATTACHMENT,
            format: surface_caps.formats[0],
            width: size.width,
            height: size.height,
            present_mode: wgpu::PresentMode::AutoVsync,
            alpha_mode: wgpu::CompositeAlphaMode::Auto,
            view_formats: vec![],
            desired_maximum_frame_latency: 2,
        };

        surface.configure(&device, &config);

        let pipeline_cache = unsafe {
            device.create_pipeline_cache(&wgpu::PipelineCacheDescriptor {
                label: Some("Pipeline Cache"),
                data: None,
                fallback: false,
            })
        };

        Ok(Self {
            device,
            surface,
            config,
            queue,
            pipeline_cache,
        })
    }
}
