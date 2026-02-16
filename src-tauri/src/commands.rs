use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct EntryPayload {
    pub image: Option<String>,
    pub title: String,
    pub figure: String,
    pub moment: String,
    pub narrative: String,
    pub keywords: Vec<String>,
    pub date_created: String,
}

#[tauri::command]
pub async fn backup_to_documents(
    payload: EntryPayload,
) -> Result<String, String> {
    // Get documents directory
    let documents_dir: PathBuf = match dirs::document_dir() {
        Some(dir) => dir,
        None => {
            return Err("Could not find documents directory".to_string());
        }
    };

    // Create DigitalGarden/Archive directory structure
    let archive_dir = documents_dir.join("DigitalGarden").join("Archive");

    if let Err(e) = fs::create_dir_all(&archive_dir) {
        return Err(format!("Failed to create archive directory: {}", e));
    }

    // Generate filename from title and date
    let sanitized_title: String = payload.title
        .chars()
        .take(30)
        .map(|c| if c.is_alphanumeric() || c == '-' || c == '_' { c } else { '_' })
        .collect();

    let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S");
    let filename = format!("{}_{}.json", sanitized_title, timestamp);
    let file_path = archive_dir.join(&filename);

    // Serialize and write (exclude image base64 for smaller files)
    let payload_for_save = serde_json::json!({
        "title": payload.title,
        "figure": payload.figure,
        "moment": payload.moment,
        "narrative": payload.narrative,
        "keywords": payload.keywords,
        "date_created": payload.date_created,
        "image_included": payload.image.is_some()
    });

    let json_content = serde_json::to_string_pretty(&payload_for_save)
        .map_err(|e| format!("Failed to serialize: {}", e))?;

    fs::write(&file_path, json_content)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(file_path.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn get_backup_path() -> Result<String, String> {
    let documents_dir: PathBuf = match dirs::document_dir() {
        Some(dir) => dir,
        None => {
            return Err("Could not find documents directory".to_string());
        }
    };

    let archive_dir = documents_dir.join("DigitalGarden").join("Archive");
    Ok(archive_dir.to_string_lossy().to_string())
}