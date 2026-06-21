import { useEffect, useState } from "react";
import "./App.css";
import RootLayout from "./components/layout/RootLayout";
import { getBaseUrl } from "./api/api";

const isTauri =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

const centerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "var(--foreground)",
  color: "var(--background)",
  fontFamily: "sans-serif",
};

function App() {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isTauri) {
      setIsBackendReady(true);
      return;
    }

    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const pingBackend = async (retries = 8) => {
      try {
        const baseUrl = await getBaseUrl();
        const response = await fetch(`${baseUrl}/api/health`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        if (mounted) {
          console.log("Motor Java iniciado com sucesso.");
          setIsBackendReady(true);
        }
      } catch (error) {
        if (!mounted) return;

        if (retries > 0) {
          console.log(
            `Aguardando o motor Java... Tentativas restantes: ${retries}`,
          );

          setRetryCount((prev) => prev + 1);

          timeoutId = setTimeout(() => {
            pingBackend(retries - 1);
          }, 1000);
        } else {
          console.error("Falha ao iniciar o motor backend.", error);
          setHasError(true);
        }
      }
    };

    pingBackend();

    return () => {
      mounted = false;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (hasError) {
    return (
      <div style={centerStyle}>
        <h1 style={{ color: "var(--destructive, #ef4444)" }}>
          Erro Crítico de Inicialização
        </h1>

        <p>Não foi possível conectar ao motor de cálculos em segundo plano.</p>

        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--muted-foreground, #6b7280)",
            marginTop: "1rem",
          }}
        >
          Tente reiniciar o SRM. Se o erro persistir, verifique os logs do
          sistema.
        </p>
      </div>
    );
  }

  if (!isBackendReady) {
    return (
      <div style={centerStyle}>
        {retryCount > 2 && (
          <>
            <h2>Iniciando SRM Suite...</h2>

            <p
              style={{
                color: "var(--muted-foreground, #6b7280)",
                marginTop: "0.5rem",
              }}
            >
              Carregando motor de simulação e banco de dados...
            </p>
          </>
        )}
      </div>
    );
  }

  return <RootLayout />;
}

export default App;
