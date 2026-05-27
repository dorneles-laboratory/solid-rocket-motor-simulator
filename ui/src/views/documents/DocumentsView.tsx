import { useEffect, useState } from "react"
import styles from "./DocumentsView.module.css"
import DocumentsSidebar from "./components/documents-sidebar/doc-sidebar"
import DocumentsHeader from "./components/documents-header/doc-header"

import { invoke } from '@tauri-apps/api/core';

import ReadingArea from "./components/documents-reading-area/doc-reading-area";

// Mocks para desenvolvimento web, dados para uso durante desenvolvimento web.
import { MOCK_GETTING_STARTED } from "../../../../content/mock/getting-started"
import { MOCK_EQUATIONS } from "../../../../content/mock/equations"

interface DocumentData {
  slug: string;
  title: string;
  author: string;
  lastEdited: string;
  group: string;
  version: string;
  readingTime: string;
  tags: string[];
  content: string;
  index: { title: string; slug: string }[];
}

export default function Documents() {
  const [activeView, setActiveView] = useState("getting-started")

  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

    if (isTauri) {
      invoke<DocumentData>('get_document', { slug: `${activeView || 'getting-started'}` })
        .then((data) => {
          setDoc(data);
          setLoading(false);
        })
        .catch((err) => {
          const errorMessage = err instanceof Error ? err.message : String(err);
          setError(errorMessage);
          setLoading(false);
        });
    } else {

      console.warn("Tauri não detectado. Usando dados Mock para desenvolvimento Web.");
      setDoc(activeView === 'getting-started' ? MOCK_GETTING_STARTED : activeView === 'equations' ? MOCK_EQUATIONS : null);
      setLoading(false);
    }
  }, [activeView]);

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--muted-foreground)' }}>Lendo arquivo...</div>;
  }

  if (error || !doc) {
    return <div style={{ padding: '2rem', color: 'red' }}>Erro: {error}</div>;
  }

  {console.log("Documento Atual:", activeView)}
  
  return (
    <main className={styles.documents_view}>
      <DocumentsHeader 
          path={doc?.group + '/' + doc?.slug + '.md' || "Documento Desconecido"}
          title={doc?.title || "Documento Desconecido"}
        />

      <div className={styles.content}>
        <DocumentsSidebar 
          onNavigate={setActiveView}
          activeView={activeView}
        />

        <main className={styles.main}>
          <ReadingArea documentData={doc} />
        </main>
      </div>
    </main>
  )
}