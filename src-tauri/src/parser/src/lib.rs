use regex::Regex;

#[derive(Debug, PartialEq)]
pub enum ParserError {
    EmptyQuery,
}

// UserMotive is an enum that represents the user's motive for searching.
#[derive(Debug, PartialEq)]
pub enum UserMotive {
    LaunchApp,
    SearchUrl,
    GeneralSearch,
}

#[derive(Debug)]
pub struct SearchQuery {
    pub raw_query: String,
    pub correct_terms: Vec<String>,
    pub user_motive: UserMotive,
    pub target: Option<String>,
}

impl SearchQuery {
    pub fn new(query: String) -> Self {
        let (motive, target, corrected_terms) = parse_query_intent(&query);

        SearchQuery {
            raw_query: query,
            correct_terms: corrected_terms,
            user_motive: motive,
            target,
        }
    }
}

// Fuzzy matching function using Levenshtein distance
fn levenshtein_distance(a: &str, b: &str) -> usize {
    let a_chars: Vec<char> = a.chars().collect();
    let b_chars: Vec<char> = b.chars().collect();
    let a_len = a_chars.len();
    let b_len = b_chars.len();

    if a_len == 0 {
        return b_len;
    }
    if b_len == 0 {
        return a_len;
    }

    let mut matrix = vec![vec![0; b_len + 1]; a_len + 1];

    // Initialize first row and column
    for i in 0..=a_len {
        matrix[i][0] = i;
    }
    for j in 0..=b_len {
        matrix[0][j] = j;
    }

    // Fill the matrix
    for i in 1..=a_len {
        for j in 1..=b_len {
            let cost = if a_chars[i - 1] == b_chars[j - 1] {
                0
            } else {
                1
            };
            matrix[i][j] = std::cmp::min(
                std::cmp::min(
                    matrix[i - 1][j] + 1, // deletion
                    matrix[i][j - 1] + 1, // insertion
                ),
                matrix[i - 1][j - 1] + cost, // substitution
            );
        }
    }

    matrix[a_len][b_len]
}

// Fuzzy match function that returns true if strings are similar enough
fn fuzzy_match(input: &str, target: &str, threshold: usize) -> bool {
    let distance = levenshtein_distance(input, target);
    distance <= threshold
}

// Function to correct action words using fuzzy matching
fn correct_action_word(word: &str) -> Option<String> {
    let actions = ["launch", "open", "start", "run"];
    let threshold = 2; // Allow up to 2 character differences

    for action in &actions {
        if fuzzy_match(word, action, threshold) {
            return Some(action.to_string());
        }
    }
    None
}

#[macro_use]
extern crate lazy_static;

const URL_REGEX: &str = r"^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$";

lazy_static! {
    static ref RE: Regex = Regex::new(URL_REGEX).unwrap();
}

// Function to detect if a string looks like a URL
fn is_url_like(s: &str) -> bool {
    // Check for common URL patterns
    RE.is_match(s)
}

// Parse the query to determine intent and extract relevant information
fn parse_query_intent(query: &str) -> (UserMotive, Option<String>, Vec<String>) {
    let words: Vec<&str> = query.split_whitespace().collect();

    if words.is_empty() {
        return (UserMotive::GeneralSearch, None, Vec::new());
    }

    let first_word = words[0].to_lowercase();

    // Check if first word is an action (with fuzzy matching)
    if let Some(corrected_action) = correct_action_word(&first_word) {
        if words.len() > 1 {
            let target = words[1..].join(" ");

            // Determine if target is URL-like or app name
            if is_url_like(&target) {
                let mut corrected_terms = vec![corrected_action];
                corrected_terms.push(target.clone());
                return (UserMotive::SearchUrl, Some(target), corrected_terms);
            } else {
                let mut corrected_terms = vec![corrected_action];
                corrected_terms.push(target.clone());
                return (UserMotive::LaunchApp, Some(target), corrected_terms);
            }
        }
    }

    // Check if the entire query is a URL
    if words.len() == 1 && is_url_like(words[0]) {
        return (
            UserMotive::SearchUrl,
            Some(words[0].to_string()),
            vec![words[0].to_string()],
        );
    }

    // Default to general search
    let terms: Vec<String> = words.iter().map(|w| w.to_lowercase()).collect();
    (UserMotive::GeneralSearch, None, terms)
}
