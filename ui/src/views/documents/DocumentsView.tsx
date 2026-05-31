import { useEffect, useState } from "react"
import styles from "./DocumentsView.module.css"
import DocumentsSidebar from "./components/documents-sidebar/doc-sidebar"
import DocumentsHeader from "./components/documents-header/doc-header"

import { invoke } from '@tauri-apps/api/core';

import ReadingArea from "./components/documents-reading-area/doc-reading-area";

// Mocks para desenvolvimento web, dados para uso durante desenvolvimento web.
import { MOCK_GETTING_STARTED } from "../../../../content/mock/getting-started"
import { MOCK_EQUATIONS } from "../../../../content/mock/equations"
import { FooterProps } from "../../components/layout/footer/footer";
import { showToast } from "../../ui/toast/toast-container";

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

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

interface DocumentCount {
  count: number;
}

interface DocumentsViewProps {
  setFooter: (data: FooterProps) => void;
}

export default function Documents({ setFooter }: DocumentsViewProps) {
  const [activeView, setActiveView] = useState("getting-started")
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [documentCount, setDocumentCount] = useState<number | null>(null);

  useEffect(() => {
    showToast({
      type: "info",
      title: "Running in Web Mode",
      message: "Tauri não detectado. Usando dados Mock para desenvolvimento Web."
    });
  }, []);

  useEffect(() => {
    setFooter({
      index: documentCount !== null ? documentCount : 0,
      description: documentCount === 1 ? "Documento encontrado" : "Documentos encontrados",
    });
  }, [documentCount, setFooter]);
  
  // Fetch document data whenever activeView changes
  useEffect(() => {
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
      setDoc(activeView === 'getting-started' ? MOCK_GETTING_STARTED : activeView === 'equations' ? MOCK_EQUATIONS : null);
      setLoading(false);
    }
  }, [activeView]);

  // Count documents on mount
  useEffect(() => {
    if (isTauri) {
      invoke<DocumentCount>('count_documents')
        .then((data) => {
          setDocumentCount(data.count);
        })
        .catch((err) => {
          showToast({
            type: "error",
            title: "Erro ao Contar Documentos",
            message: err instanceof Error ? err.message : String(err)
          });
        });
    } else {
      setDocumentCount(2);
    }
  }, []);


  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--muted-foreground)' }}>Lendo arquivo...</div>;
  }

  if (error || !doc) {
    return <div style={{ padding: '2rem', color: 'red' }}>Erro: {error}</div>;
  }

  return (
    <section className={styles.documents_view}>
      <DocumentsHeader 
          path={doc?.group + '/' + doc?.slug + '.md' || "Documento Desconhecido"}
          title={doc?.title || "Documento Desconhecido"}
        />

      <div className={styles.content}>
        <DocumentsSidebar 
          onNavigate={setActiveView}
          activeView={activeView}
        />

        <section className={styles.main}>
          <ReadingArea documentData={doc} />
        </section>
      </div>
    </section>
  )
}