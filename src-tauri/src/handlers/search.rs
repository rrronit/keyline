use std::process::Command;

use keyline_parser::{SearchQuery, UserMotive};

#[tauri::command]
pub fn handle_search(query: String) -> Result<(), String> {
    let search_query = SearchQuery::new(query);

    match search_query.user_motive {
        UserMotive::GeneralSearch => {
            println!("Searching for: {}", search_query.raw_query);
            println!("Search terms: {:?}", search_query.correct_terms);
            println!("User motive: {:?}", search_query.user_motive);
            println!("Target: {:?}", search_query.target);
        }
        UserMotive::LaunchApp => {
            let app_name = search_query.target.unwrap();
            let _ = Command::new(app_name).spawn();
        }
        UserMotive::SearchUrl => {
            println!("Searching for URL: {}", search_query.raw_query);
        }
    }

    Ok(())
}
