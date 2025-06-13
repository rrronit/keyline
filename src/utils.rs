use display_info::DisplayInfo;

pub fn get_screen_size() -> (u32, u32) {
    let display_info = DisplayInfo::all().unwrap();
    let width = display_info[0].width;
    let height = display_info[0].height;
    (width, height)
}


