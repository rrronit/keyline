struct VertexInput {
    @location(0) position: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) local_pos: vec2<f32>,
}

@group(0) @binding(0)
var<uniform> rect_info: vec4<f32>; // x, y, width, height

@group(0) @binding(1)
var<uniform> radius: f32;

@group(0) @binding(2)
var<uniform> color: vec4<f32>;

@vertex
fn vs_main(input: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    out.position = vec4(input.position, 0.0, 1.0);
    
    // Pass through the position directly for the fragment shader
    out.local_pos = input.position;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    // Input position is in clip space (-1 to 1)
    let pos = in.local_pos;
    
    // Define rectangle size in clip space
    let rect_size = vec2(0.8, 0.6); // Width and height in clip space
    let corner_radius = 0.1; // Radius in clip space (adjust for desired pixel size)
    
    // Calculate distance from rounded rectangle center
    let d = abs(pos) - rect_size + vec2(corner_radius);
    let dist = length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - corner_radius;
    
    // Create smooth anti-aliased edge
    let alpha = 1.0 - smoothstep(-0.01, 0.01, dist);
    
    return vec4(color.rgb, color.a * alpha);
}