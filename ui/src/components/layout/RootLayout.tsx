import { useState } from "react";
import styles from "./RootLayout.module.css"
import Sidebar from "./sidebar/sidebar";
import Header from "./header/header";

import { 
  Home as IconHome, 
  FolderPlus as IconPlus, 
  FolderOpen as IconFolder, 
  LayoutDashboard as IconDashboard,
  Shapes as IconGeometry,
  Gauge as IconBoundary,
  FileText as IconReports,
  Layers as IconStructural,
  Cog as IconMotors,
  Flame as IconThermal,
  BookOpen as IconDocuments,
  Settings as IconSettings,
  FlaskConical as IconPropellants,
} from "lucide-react";

import HomeView from "../../views/home/HomeView";
import NewProjectView from "../../views/new-project/NewProjectView";
import OpenProjectView from "../../views/open-project/OpenProjectView";
import DashboardView from "../../views/dashboard/DashboardView";
import GeometryEditorView from "../../views/geometry-editor/GeometryEditorView";
import ReportsView from "../../views/reports/ReportsView";
import BoundaryConditionsView from "../../views/boundary-conditions/BoundaryConditionsView";
import PropellantsView from "../../views/propellants/PropellantsView";
import StructuralMaterialsView from "../../views/structural-materials/StructuralMaterialsView";
import ThermalMaterialsView from "../../views/thermal-materials/ThermalMaterialsView";
import CommercialMotorsView from "../../views/commercial-motors/CommercialMotorsView";
import DocumentsView from "../../views/documents/DocumentsView";
import SettingsView from "../../views/settings/SettingsView";

const VIEW_CONFIG: Record<string, { title: string; icon: React.ReactNode, search?: boolean }> = {
  "home": { title: "Página Inicial", icon: <IconHome /> },
  "new-project": { title: "Novo Projeto", icon: <IconPlus /> },
  "open-project": { title: "Abrir Projeto", icon: <IconFolder /> },
  "dashboard": { title: "Dashboard", icon: <IconDashboard /> },
  "dashboard/geometry-editor": { title: "Editor de Geometria", icon: <IconGeometry /> },
  "dashboard/boundary-conditions": { title: "Condições de Contorno", icon: <IconBoundary /> },
  "dashboard/reports": { title: "Relatórios", icon: <IconReports /> },
  "propellants": { title: "Propelentes", icon: <IconPropellants /> },
  "structural-materials": { title: "Materiais Estruturais", icon: <IconStructural /> },
  "thermal-materials": { title: "Materiais Térmicos", icon: <IconThermal /> },
  "commercial-motors": { title: "Motores Comerciais", icon: <IconMotors /> },
  "documents": { title: "Documentos", icon: <IconDocuments />, search: true },
  "settings": { title: "Configurações", icon: <IconSettings /> },
};

export default function RootLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeView, setActiveView] = useState("home")

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const currentViewInfo = VIEW_CONFIG[activeView] || VIEW_CONFIG["home"];

  return (
    <div className={styles.root_layout}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={handleToggleSidebar}
        onNavigate={setActiveView}
        activeView={activeView}
      />
      
      <div className={styles.content}>
        <Header path={[activeView]}
          title={currentViewInfo.title}
          icon={currentViewInfo.icon}
          showSearch={currentViewInfo.search}
        />

        <main className={styles.main}>
          {activeView === "home" && <HomeView />}

          {activeView === "new-project" && <NewProjectView />}
          {activeView === "open-project" && <OpenProjectView />}

          {activeView === "dashboard" && <DashboardView />}
          {activeView === "dashboard/geometry-editor" && <GeometryEditorView />}
          {activeView === "dashboard/boundary-conditions" && <BoundaryConditionsView />}
          {activeView === "dashboard/reports" && <ReportsView />}

          {activeView === "propellants" && <PropellantsView />}
          {activeView === "structural-materials" && <StructuralMaterialsView />}
          {activeView === "thermal-materials" && <ThermalMaterialsView />}
          {activeView === "commercial-motors" && <CommercialMotorsView />}

          {activeView === "documents" && <DocumentsView />}
          {activeView === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
} 