import { FilePlus2, FolderOpen, FlaskConical, BookOpen, Settings, Home, FolderPlus, Layers, Gauge, LayoutDashboard, FileText, Flame, Database, Shield } from "lucide-react"
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

export default function Sidebar({collapsed, onToggle, onNavigate, activeView="home"}: SidebarProps) {
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

        {/* PROJETO Section */}
        <NavGroup title="Projeto" collapsed={collapsed}>
          <NavItem
            icon={<FolderPlus className={styles.icon} strokeWidth={1.5} />}
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

        {/* PROJETO ATUAL Section */}
        <NavGroup title="Projeto Atual" collapsed={collapsed}>
          <NavItem
            icon={<LayoutDashboard className={styles.icon} strokeWidth={1.5} />}
            label="Dashboard"
            collapsed={collapsed}
            onClick={() => onNavigate("dashboard")}
            active={activeView === "dashboard"}
          />
          <NavItem
            icon={<Layers className={styles.icon} strokeWidth={1.5} />}
            label="Editor de Geometria"
            collapsed={collapsed}
            onClick={() => onNavigate("dashboard/geometry-editor")}
            active={activeView === "dashboard/geometry-editor"}
            indent
          />
          <NavItem
            icon={<Gauge className={styles.icon} strokeWidth={1.5} />}
            label="Condições de Contorno"
            collapsed={collapsed}
            onClick={() => onNavigate("dashboard/boundary-conditions")}
            active={activeView === "dashboard/boundary-conditions"}
            indent
          />
          <NavItem
            icon={<FileText className={styles.icon} strokeWidth={1.5} />}
            label="Relatórios / Exportação"
            collapsed={collapsed}
            onClick={() => onNavigate("dashboard/reports")}
            active={activeView === "dashboard/reports"}
            indent
          />
        </NavGroup>

        {/* BIBLIOTECA Section */}
        <NavGroup title="Biblioteca" collapsed={collapsed}>
          <NavItem
            icon={<FlaskConical className={styles.icon} strokeWidth={1.5} />}
            label="Propelentes"
            collapsed={collapsed}
            onClick={() => onNavigate("propellants")}
            active={activeView === "propellants"}
          />
          <NavItem
            icon={<Shield className={styles.icon} strokeWidth={1.5} />}
            label="Materiais Estruturais"
            collapsed={collapsed}
            onClick={() => onNavigate("structural-materials")}
            active={activeView === "structural-materials"}
          />
          <NavItem
            icon={<Flame className={styles.icon} strokeWidth={1.5} />}
            label="Materiais Térmicos"
            collapsed={collapsed}
            onClick={() => onNavigate("thermal-materials")}
            active={activeView === "thermal-materials"}
          />
          <NavItem
            icon={<Database className={styles.icon} strokeWidth={1.5} />}
            label="Motores Comerciais"
            collapsed={collapsed}
            onClick={() => onNavigate("commercial-motors")}
            active={activeView === "commercial-motors"}
          />
        </NavGroup>

        {/* SISTEMA Section */}
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