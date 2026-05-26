import styles from './doc-sidebar.module.css';
import NavGroup from './doc-sidebar-group';
import NavItem from './doc-sidebar-item';
import { ChevronRight } from 'lucide-react';

interface DocumentsSidebarProps {
  onNavigate: (view: string) => void
  activeView: string
}

export default function DocumentsSidebar({ activeView, onNavigate }: DocumentsSidebarProps) {
  return (
     <aside className={styles.sidebar}>
      

      {/* Navigation Groups */}
      <nav className={styles.navigation}>
         <NavGroup title="Início">
          <NavItem
            icon={<ChevronRight className={styles.icon} strokeWidth={1.5} />}
            label="Início"
            onClick={() => onNavigate("home")}
            active={activeView === "home"}
          />
        </NavGroup>

        {/* PROJETO Section */}
        <NavGroup title="Projeto">
          <NavItem
            icon={<ChevronRight className={styles.icon} strokeWidth={1.5} />}
            label="Novo Projeto"
            onClick={() => onNavigate("new-project")}
            active={activeView === "new-project"}
          />
          <NavItem
            icon={<ChevronRight className={styles.icon} strokeWidth={1.5} />}
            label="Abrir Projeto"
            onClick={() => onNavigate("open-project")}
            active={activeView === "open-project"}
          />
        </NavGroup>

        {/* PROJETO ATUAL Section */}
        <NavGroup title="Projeto Atual">
          <NavItem
            icon={<ChevronRight className={styles.icon} strokeWidth={1.5} />}
            label="Dashboard"
            onClick={() => onNavigate("dashboard")}
            active={activeView === "dashboard"}
          />
          <NavItem
            icon={<ChevronRight className={styles.icon} strokeWidth={1.5} />}
            label="Editor de Geometria"
            onClick={() => onNavigate("dashboard/geometry-editor")}
            active={activeView === "dashboard/geometry-editor"}
            indent
          />
          <NavItem
            icon={<ChevronRight className={styles.icon} strokeWidth={1.5} />}
            label="Condições de Contorno"
            onClick={() => onNavigate("dashboard/boundary-conditions")}
            active={activeView === "dashboard/boundary-conditions"}
            indent
          />
          <NavItem
            icon={<ChevronRight className={styles.icon} strokeWidth={1.5} />}
            label="Relatórios / Exportação"
            onClick={() => onNavigate("dashboard/reports")}
            active={activeView === "dashboard/reports"}
            indent
          />
        </NavGroup>
      </nav>
    </aside>
  )
}