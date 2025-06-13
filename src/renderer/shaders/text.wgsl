struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) uv: vec2<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) frag_uv: vec2<f32>,
};

@vertex
fn vs_main(input: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    out.position = vec4(input.position, 0.0, 1.0);
    out.frag_uv = input.uv;
    return out;
}

@group(0) @binding(0)
var atlas: texture_2d<f32>;

@group(0) @binding(1)
var atlas_sampler: sampler;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let color = textureSample(atlas, atlas_sampler, in.frag_uv);
    return vec4(1.0, 1.0, 1.0, color.r); // monochrome glyph
}
