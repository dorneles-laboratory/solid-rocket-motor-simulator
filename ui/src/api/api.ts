import { invoke } from "@tauri-apps/api/core";

let apiBaseUrl = "";

export async function getBaseUrl(): Promise<string> {
  if (apiBaseUrl) return apiBaseUrl;

  // Verifica se estamos rodando dentro da janela nativa do Tauri
  const isTauri = "__TAURI_INTERNALS__" in window;

  if (!isTauri) {
    console.log(
      "🌐 Rodando no navegador comum. Usando porta padrão de dev (8080).",
    );
    apiBaseUrl = "http://localhost:8080";
    return apiBaseUrl;
  }

  try {
    // Se estiver no Tauri, pede a porta para o Rust
    const port = await invoke<number>("get_api_port");
    apiBaseUrl = `http://localhost:${port}`;
    console.log("🚀 Backend conectado em:", apiBaseUrl);
    return apiBaseUrl;
  } catch (error) {
    console.error("Erro ao se comunicar com o Rust:", error);
    apiBaseUrl = "http://localhost:8080";
    return apiBaseUrl;
  }
}
