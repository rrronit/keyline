use std::{
    fs::File,
    io::{BufReader, Read},
};

fn _load_shader_from_file(path: &str) -> String {
    let file = File::open(path).unwrap();
    let mut reader = BufReader::new(file);
    let mut shader = String::new();
    reader.read_to_string(&mut shader).unwrap();
    shader
}

fn _load_shader_from_files(paths: &[&str]) -> String {
    paths
        .iter()
        .map(|path| _load_shader_from_file(path))
        .collect::<Vec<String>>()
        .join("\n")
}
