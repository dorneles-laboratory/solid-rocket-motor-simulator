import styles from "./doc-document.module.css";
import ReactMarkdown from 'react-markdown';

import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface DocumentProps {
  documentData: {
    content: string;
  };
}

export default function Document({ documentData }: DocumentProps) {
  return (
    <div className={styles.document}>
      <ReactMarkdown 
        remarkPlugins={[remarkMath]} 
        rehypePlugins={[rehypeRaw, rehypeKatex]} 
      >
        {documentData.content}
      </ReactMarkdown>
    </div>
  );
}