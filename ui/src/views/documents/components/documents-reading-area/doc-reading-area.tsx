import Document from './doc-document';
import styles from './doc-reading-area.module.css';

interface DocumentProps {
  documentData: {
    title: string;
    author: string;
    lastEdited: string;
    content: string;
    version?: string;     // Substitui o status
    readingTime?: string; // Nova informação útil
    tags?: string[];      // Lista de palavras-chave
    index: { title: string; slug: string }[];
  }
}

export default function ReadingArea({ documentData }: DocumentProps) {
  return (
    <div className={styles.reading_area}>
      <div className={styles.document_texts_area}>
        <div className={styles.header_section}>
          <h1 className={styles.document_title}>{documentData.title}</h1>
          <div className={styles.document_metadata}>
            <span className={styles.badge}>Author: {documentData.author}</span>
            <span className={styles.badge}>Last Edited: {documentData.lastEdited}</span>
          </div>
        </div>

        <Document documentData={documentData} />
      </div>

       <div className={styles.aside}>
          <div className={styles.aside_index}>
            <h3 className={styles.aside_title}>Índice</h3>

            <ul className={styles.index_list}>
              {documentData.index.map((item, i) => (
                <li key={i} className={styles.index_item}>
                  <a href={`#${item.slug}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={styles.aside_info}>
            <h3 className={styles.aside_title}>Detalhes</h3>
            
            <div className={styles.details_list}>
              {documentData.version && (
                <div className={styles.detail_item}>
                  <span>Versão:</span>
                  <strong>{documentData.version}</strong>
                </div>
              )}
              
              {documentData.readingTime && (
                <div className={styles.detail_item}>
                  <span>Tempo de Leitura:</span>
                  <strong>{documentData.readingTime}</strong>
                </div>
              )}

              {documentData.tags && documentData.tags.length > 0 && (
                <div className={styles.tags_container}>
                  {documentData.tags.map((tag, i) => (
                    <span key={i} className={styles.tag_chip}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>        
        </div>
    </div>
  );
}