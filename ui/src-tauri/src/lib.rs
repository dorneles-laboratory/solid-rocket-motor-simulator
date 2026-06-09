use regex::Regex;
use serde::{Deserialize, Serialize};
use std::fs;
#[cfg(not(debug_assertions))]
use std::process::Command;
use std::sync::Mutex;
use tauri::{Manager, RunEvent};

// --- ESTRUTURAS DE DADOS (Markdown/MDX) ---

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

#[derive(Serialize)]
pub struct DocumentCount {
    pub count: usize,
}

// --- ESTRUTURA DO BACKEND JAVA ---
struct BackendProcess(Mutex<Option<std::process::Child>>);


// --- COMANDOS NATIVOS (IPC) ---

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_document(slug: String) -> Result<DocumentData, String> {
    let mut path = std::env::current_dir().map_err(|e| e.to_string())?;
    
    if path.ends_with("src-tauri") {
        path.pop();
        path.pop();
    } else if path.ends_with("ui") {
        path.pop();
    }
    
    path.push("content");
    path.push("docs");
    path.push(format!("{}.mdx", slug));

    let file_contents = fs::read_to_string(&path)
        .map_err(|_| format!("Arquivo não encontrado: {:?}", path))?;

    let re = Regex::new(r"(?s)^---\s*(.*?)\s*---\s*(.*)$").unwrap();

    if let Some(caps) = re.captures(&file_contents) {
        let yaml_content = caps.get(1).unwrap().as_str();
        let markdown_content = caps.get(2).unwrap().as_str();

        let fm: Frontmatter = serde_yaml::from_str(yaml_content)
            .map_err(|e| format!("Erro ao ler metadados: {}", e))?;

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

    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            let file_path = entry.path();
            
            if file_path.extension().and_then(|s| s.to_str()) == Some("mdx") {
                let slug = file_path.file_stem().unwrap().to_str().unwrap().to_string();
                
                if let Ok(content) = fs::read_to_string(&file_path) {
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

#[tauri::command]
fn count_documents() -> Result<DocumentCount, String> {
    let mut path = std::env::current_dir().map_err(|e| e.to_string())?;
    
    if path.ends_with("src-tauri") {
        path.pop(); path.pop();
    } else if path.ends_with("ui") {
        path.pop();
    }
    path.push("content");
    path.push("docs");

    let mut count = 0;
    
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            let file_path = entry.path();
            
            if file_path.extension().and_then(|s| s.to_str()) == Some("mdx") {
                count += 1;
            }
        }
    }

    Ok(DocumentCount { count }) 
}


// --- INICIALIZAÇÃO DO TAURI ---
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Registra os Plugins Originais
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        
        // Registra os seus comandos IPC do MDX
        .invoke_handler(tauri::generate_handler![
            greet, 
            get_document, 
            list_documents, 
            count_documents
        ])
        
        // Injeta o Backend na inicialização (Spring Boot)
        .setup(|app| {
            #[cfg(not(debug_assertions))]
            {
                // MODO PRODUÇÃO: O cliente abriu o .exe
                let jar_path = app
                    .path()
                    .resource_dir()
                    .expect("Falha ao encontrar a pasta de recursos")
                    .join("engine.jar");

                //Inicia o Java apontando exatamente para esse caminho
                let child = Command::new("java")
                    .arg("-jar")
                    .arg(jar_path)
                    .arg("--spring.profiles.active=prod")
                    .spawn()
                    .expect("Falha ao iniciar o Spring Boot. O Java está instalado?");

                app.manage(BackendProcess(Mutex::new(Some(child))));
            }

            #[cfg(debug_assertions)]
            {
                app.manage(BackendProcess(Mutex::new(None)));
            }

            Ok(())
        })
        
        // Constrói e gerencia o ciclo de vida da aplicação
        .build(tauri::generate_context!())
        .expect("Erro ao construir o aplicativo Tauri")
        .run(|app_handle, event| {
            if let RunEvent::Exit = event {
                // Pega o estado encapsulado do Tauri
                let state = app_handle.state::<BackendProcess>();
                // Cria um escopo isolado para o MutexGuard viver e morrer em paz
                let mut process_guard = match state.inner().0.lock() {
                    Ok(guard) => guard,
                    Err(poisoned) => poisoned.into_inner(), // Resolve caso a thread tenha morrido antes
                };

                // Se houver um processo rodando, nós o matamos e retiramos da memória
                if let Some(mut process) = process_guard.take() {
                    let _ = process.kill();
                }
            }
        });
}