import { useEffect, useState } from "react";
import "./App.css";
import RootLayout from "./components/layout/RootLayout";

function App() {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const pingBackend = async (retries = 8) => {
      try {
        const response = await fetch("http://localhost:8080/api/health");
        if (response.ok) {
          setIsBackendReady(true);
        }
      } catch (error) {
        if (retries > 0) {
          console.log(
            `Aguardando o motor Java... Tentativas restantes: ${retries}`,
          );
          setTimeout(() => pingBackend(retries - 1), 1000);
        } else {
          console.error("Falha ao iniciar o motor backend." + error);
          setHasError(true);
        }
      }
    };

    pingBackend();
  }, []);

  if (hasError) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontFamily: "sans-serif",
        }}
      >
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Mais tarde eu coloco a LOGO */}
        <h2>Iniciando SRM Suite...</h2>
        <p
          style={{
            color: "var(--muted-foreground, #6b7280)",
            marginTop: "0.5rem",
          }}
        >
          Carregando motor de simulação e banco de dados...
        </p>
      </div>
    );
  }

  return (
    <>
      <RootLayout />
    </>
  );
}

export default App;
