use regex::Regex;
use serde::{Deserialize, Serialize};
use std::fs;

// --- ESTRUTURAS DE DADOS ---

#[derive(Debug, Serialize, Deserialize)]
pub struct IndexItem {
    title: String,
    slug: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SidebarItem {
    slug: String,
    title: String,
    group: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DocumentData {
    slug: String,
    content: String,
    title: String,
    author: String,
    #[serde(rename = "lastEdited")]
    last_edited: String,
    group: String,
    version: Option<String>,
    tags: Option<Vec<String>>,
    #[serde(rename = "readingTime")]
    reading_time: Option<String>,
    index: Vec<IndexItem>,
}

#[derive(Debug, Deserialize)]
struct Frontmatter {
    title: String,
    author: String,
    #[serde(rename = "lastEdited")]
    last_edited: String,
    #[serde(default)]
    group: Option<String>,
    version: Option<String>,
    #[serde(rename = "readingTime")]
    reading_time: Option<String>,
    tags: Option<Vec<String>>,
    #[serde(default)]
    index: Vec<IndexItem>,
}
// --- COMANDOS NATIVOS (IPC) ---
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_document(slug: String) -> Result<DocumentData, String> {
    // Resolve o caminho dinamicamente para encontrar a pasta /content/docs
    let mut path = std::env::current_dir().map_err(|e| e.to_string())?;
    
    // Recua para a raiz do monorepo
    if path.ends_with("src-tauri") {
        path.pop();
        path.pop();
    } else if path.ends_with("ui") {
        path.pop();
    }
    
    path.push("content");
    path.push("docs");
    path.push(format!("{}.mdx", slug));

    // Lê o arquivo do disco
    let file_contents = fs::read_to_string(&path)
        .map_err(|_| format!("Arquivo não encontrado: {:?}", path))?;

    // Separa o YAML (Frontmatter) do Markdown usando Regex
    let re = Regex::new(r"(?s)^---\s*(.*?)\s*---\s*(.*)$").unwrap();

    if let Some(caps) = re.captures(&file_contents) {
        let yaml_content = caps.get(1).unwrap().as_str();
        let markdown_content = caps.get(2).unwrap().as_str();

        // Faz o parse do YAML para a estrutura Rust
        let fm: Frontmatter = serde_yaml::from_str(yaml_content)
            .map_err(|e| format!("Erro ao ler metadados: {}", e))?;

        // Retorna os dados limpos para o React
        Ok(DocumentData {
            slug,
            content: markdown_content.trim().to_string(),
            title: fm.title,
            author: fm.author,
            group: fm.group.unwrap_or_else(|| "Outros".to_string()),
            last_edited: fm.last_edited,
            version: fm.version,
            reading_time: fm.reading_time,
            tags: fm.tags,
            index: fm.index,
        })
    } else {
        Err("Documento não possui o bloco de metadados padrão.".to_string())
    }
}

#[tauri::command]
fn list_documents() -> Result<Vec<SidebarItem>, String> {
    let mut path = std::env::current_dir().map_err(|e| e.to_string())?;
    
    if path.ends_with("src-tauri") {
        path.pop(); path.pop();
    } else if path.ends_with("ui") {
        path.pop();
    }
    path.push("content");
    path.push("docs");

    let mut docs_list = Vec::new();
    let re = Regex::new(r"(?s)^---\s*(.*?)\s*---").unwrap();

    // Lê a pasta inteira
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            let file_path = entry.path();
            
            // Filtra apenas arquivos .mdx
            if file_path.extension().and_then(|s| s.to_str()) == Some("mdx") {
                let slug = file_path.file_stem().unwrap().to_str().unwrap().to_string();
                
                if let Ok(content) = fs::read_to_string(&file_path) {
                    // Extrai apenas o frontmatter
                    if let Some(caps) = re.captures(&content) {
                        let yaml_content = caps.get(1).unwrap().as_str();
                        
                        if let Ok(fm) = serde_yaml::from_str::<Frontmatter>(yaml_content) {
                            docs_list.push(SidebarItem {
                                slug,
                                title: fm.title,
                                group: fm.group.unwrap_or_else(|| "Outros".to_string()),
                            });
                        }
                    }
                }
            }
        }
    }

    Ok(docs_list)
}

// --- INICIALIZAÇÃO DO TAURI ---
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_document, list_documents])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}