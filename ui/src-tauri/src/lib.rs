use regex::Regex;
use serde::{Deserialize, Serialize};
use std::fs;
use std::sync::Mutex;
use tauri::{Manager, RunEvent};
use tauri_plugin_shell::process::CommandChild;
#[cfg(not(debug_assertions))]
use std::net::TcpListener;
#[cfg(not(debug_assertions))]
use tauri_plugin_shell::ShellExt;
#[cfg(not(debug_assertions))]
use std::fs::OpenOptions;
#[cfg(not(debug_assertions))]
use std::io::Write;
#[cfg(not(debug_assertions))]
use tauri_plugin_shell::process::CommandEvent;

#[cfg(target_os = "windows")]

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
    #[serde(default)]
    tags: Option<Vec<String>>,
    #[serde(default)]
    index: Vec<IndexItem>,
}

#[derive(Serialize)]
pub struct DocumentCount {
    pub count: usize,
}

// --- ESTRUTURA DO BACKEND JAVA ---
struct BackendProcess(Mutex<Option<CommandChild>>);

// Estrutura para guardar a porta na memória do Tauri
struct AppConfig {
    api_port: u16,
}

// --- COMANDOS NATIVOS (IPC) ---
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Acha uma porta vazia no SO
#[cfg(not(debug_assertions))]
fn get_available_port() -> u16 {
    // Ao pedir a porta 0, o Windows devolve a primeira porta livre que encontrar
    TcpListener::bind("127.0.0.1:0")
        .expect("Falha ao buscar uma porta livre no sistema")
        .local_addr()
        .unwrap()
        .port()
}

#[tauri::command]
fn get_api_port(state: tauri::State<AppConfig>) -> u16 {
    state.api_port
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
    // Em DEV: Usa a 8080 fixa para rodar o Spring Boot manualmente
    #[cfg(debug_assertions)]
    let api_port = 8080;

    // Em PROD: Busca a porta dinâmica no sistema do usuário
    #[cfg(not(debug_assertions))]
    let api_port = get_available_port();

    tauri::Builder::default()
        // Inicializa obrigatoriamente os plugins da v2
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        
        .invoke_handler(tauri::generate_handler![
            greet, 
            get_document, 
            list_documents, 
            count_documents,
            get_api_port
        ])
        
        .setup(move |app| {
            // Salva a porta no estado do aplicativo para o frontend consultar
            app.manage(AppConfig { api_port });

            #[cfg(not(debug_assertions))]
            {
                let sidecar_command = app
                    .shell()
                    .sidecar("engine")
                    .expect("Falha ao carregar a configuração do sidecar 'engine'")
                    .arg(format!("--server.port={}", api_port))
                    .arg("--spring.profiles.active=prod");

                // Aqui captura o "rx" (Receiver) que ouve o terminal do Java
                let (mut rx, child) = sidecar_command
                    .spawn()
                    .expect("Falha ao iniciar o executável nativo do Spring Boot");

                // --- SISTEMA DE LOGS DO SIDECAR ---
                tauri::async_runtime::spawn(async move {
                    // Cria o arquivo de log direto na raiz do projeto
                    let log_path = std::path::Path::new("C:\\projects\\srm\\srm-backend.log");

                    let mut file = OpenOptions::new()
                        .create(true)
                        .write(true)
                        .truncate(true)
                        .open(&log_path)
                        .expect("Falha ao abrir/criar arquivo de log");

                    let _ = writeln!(file, "\n\n=== INICIANDO EXECUTÁVEL (PORTA {}) ===", api_port);

                    // Ouvindo o processo enquanto ele estiver vivo
                    while let Some(event) = rx.recv().await {
                        match event {
                            CommandEvent::Stdout(line) => {
                                let _ = writeln!(file, "[INFO] {}", String::from_utf8_lossy(&line));
                            }
                            CommandEvent::Stderr(line) => {
                                let _ = writeln!(file, "[ERRO] {}", String::from_utf8_lossy(&line));
                            }
                            CommandEvent::Terminated(payload) => {
                                let _ = writeln!(file, "[FIM] Processo morreu. Código de saída: {:?}", payload.code);
                            }
                            CommandEvent::Error(err) => {
                                let _ = writeln!(file, "[CRASH] Falha ao executar o comando: {}", err);
                            }
                            _ => {}
                        }
                    }
                });
                // ----------------------------------

                app.manage(BackendProcess(Mutex::new(Some(child))));
            }

            #[cfg(debug_assertions)]
            {
                app.manage(BackendProcess(Mutex::new(None)));
            }

            Ok(())
        })
        
        .build(tauri::generate_context!())
        .expect("Erro ao construir o aplicativo Tauri")
        .run(|app_handle, event| {
            if let RunEvent::Exit = event {
                let state = app_handle.state::<BackendProcess>();
                let mut process_guard = match state.inner().0.lock() {
                    Ok(guard) => guard,
                    Err(poisoned) => poisoned.into_inner(),
                };

                if let Some(process) = process_guard.take() {
                    // Encerra o processo nativo imediatamente ao fechar a janela principal
                    let _ = process.kill();
                }
            }
        });
}