import { FilePlus2, FolderOpen, FlaskConical, BookOpen, Settings, Home } from "lucide-react"
import { SidebarHeader } from "./sidebar-header"
import NavGroup from "./sidebar-group"
import NavItem from "./sidebar-item"
import SidebarThemeToggle from "./sidebar-theme-toggle"
import SidebarCollapseButton from "./sidebar-collapse-button"
import styles from "./sidebar.module.css"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onNavigate: (view: string) => void
  activeView: string
}

export default function AppSidebar({collapsed, onToggle, onNavigate, activeView="home"}: SidebarProps) {
  return (
    <aside className={`
      ${styles.sidebar}
      ${collapsed ? styles.collapsed : styles.expanded}
    `}>
      <SidebarHeader collapsed={collapsed} />

      {/* Navigation Groups */}
      <nav className={
          collapsed
            ? styles.navigationCollapsed
            : styles.navigation
        }>

        <NavItem
            icon={<Home className={styles.icon} strokeWidth={1.5} />}
            label="Início"
            collapsed={collapsed}
            onClick={() => onNavigate("home")}
            active={activeView === "home"}
        />

        <NavGroup title="Projeto" collapsed={collapsed}>
          <NavItem
            icon={<FilePlus2 className={styles.icon} strokeWidth={1.5} />}
            label="Novo Projeto"
            collapsed={collapsed}
            onClick={() => onNavigate("new-project")}
            active={activeView === "new-project"}
          />
          <NavItem
            icon={<FolderOpen className={styles.icon} strokeWidth={1.5} />}
            label="Abrir Projeto"
            collapsed={collapsed}
            onClick={() => onNavigate("open-project")}
            active={activeView === "open-project"}
          />
        </NavGroup>

        <NavGroup title="Biblioteca" collapsed={collapsed}>
          <NavItem
            icon={<FlaskConical className={styles.icon} strokeWidth={1.5} />}
            label="Propelentes"
            collapsed={collapsed}
            onClick={() => onNavigate("propellants")}
            active={activeView === "propellants"}
          />
        </NavGroup>

        <NavGroup title="Sistema" collapsed={collapsed}>
          <NavItem
            icon={<BookOpen className={styles.icon} strokeWidth={1.5} />}
            label="Documentação"
            collapsed={collapsed}
            onClick={() => onNavigate("documents")}
            active={activeView === "documents"}
          />
          <NavItem
            icon={<Settings className={styles.icon} strokeWidth={1.5} />}
            label="Configurações"
            collapsed={collapsed}
            onClick={() => onNavigate("settings")}
            active={activeView === "settings"}
          />
        </NavGroup>
      </nav>

      {/* Theme Toggle */}
      <SidebarThemeToggle collapsed={collapsed} />

      {/* Collapse Button */}
      <SidebarCollapseButton collapsed={collapsed} onToggle={onToggle} />
    </aside>
  );
}