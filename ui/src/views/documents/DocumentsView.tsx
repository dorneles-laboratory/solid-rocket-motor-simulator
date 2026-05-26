import { useState } from "react"
import styles from "./DocumentsView.module.css"
import DocumentsSidebar from "./components/doc-sidebar"
import ComingSoon from "../../components/cooming-soon/coming-soon"

export default function Documents() {
  const [activeView, setActiveView] = useState("home")
  
  return (
    <main className={styles.documents_view}>
      <DocumentsSidebar 
        onNavigate={setActiveView}
        activeView={activeView}
      />

      <ComingSoon />
    </main>
  )
}