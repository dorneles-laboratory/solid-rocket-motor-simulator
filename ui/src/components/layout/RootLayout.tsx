import { useState } from "react";
import { useShortcut } from "../../hooks/use-shortcut";
import styles from "./RootLayout.module.css";
import Sidebar from "./sidebar/sidebar";
import Header from "./header/header";
import Footer, { FooterProps } from "./footer/footer";

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
import GeometryEditorView from "../../views/dashboard/pages/geometry-editor/GeometryEditorView";
import ReportsView from "../../views/dashboard/pages/reports/ReportsView";
import BoundaryConditionsView from "../../views/dashboard/pages/boundary-conditions/BoundaryConditionsView";
import PropellantsView from "../../views/propellants/PropellantsView";
import StructuralMaterialsView from "../../views/structural-materials/StructuralMaterialsView";
import ThermalMaterialsView from "../../views/thermal-materials/ThermalMaterialsView";
import CommercialMotorsView from "../../views/commercial-motors/CommercialMotorsView";
import DocumentsView from "../../views/documents/DocumentsView";
import SettingsView from "../../views/settings/SettingsView";
import { ToastContainer } from "../../ui/toast/toast-container";

const VIEW_CONFIG: Record<
  string,
  { title: string; icon: React.ReactNode; search?: boolean }
> = {
  home: { title: "Página Inicial", icon: <IconHome /> },
  "new-project": { title: "Novo Projeto", icon: <IconPlus /> },
  "open-project": { title: "Abrir Projeto", icon: <IconFolder /> },
  "dashboard": { title: "Dashboard", icon: <IconDashboard /> },
  "dashboard/geometry-editor": { title: "Editor de Geometria", icon: <IconGeometry /> },
  "dashboard/boundary-conditions": { title: "Condições de Contorno", icon: <IconBoundary /> },
  "dashboard/reports": { title: "Relatórios", icon: <IconReports /> },

  "dashboard/motor-geometry": { title: "Painel de Entrada", icon: <IconDashboard /> },

  "propellants": { title: "Propelentes", icon: <IconPropellants /> },
  "structural-materials": { title: "Materiais Estruturais", icon: <IconStructural /> },
  "thermal-materials": { title: "Materiais Térmicos", icon: <IconThermal /> },
  "commercial-motors": { title: "Motores Comerciais", icon: <IconMotors /> },
  "documents": { title: "Documentos", icon: <IconDocuments /> },
  "settings": { title: "Configurações", icon: <IconSettings /> },
};

export default function RootLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [footerData, setFooterData] = useState<FooterProps>({ description: "SRM Engine v1.0" });

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigate = (path: string) => {
    if (path.includes("?projectId=")) {
      const [routePart, queryPart] = path.split("?projectId=");
      const cleanView = routePart.startsWith("/") ? routePart.substring(1) : routePart;

      setSelectedProjectId(queryPart);
      setActiveView(cleanView);
    } else {
      setActiveView(path);
    }
  };

  useShortcut("n", () => handleNavigate("new-project"), { ctrl: true }); // Ctrl + N
  useShortcut("o", () => handleNavigate("open-project"), { ctrl: true }); // Ctrl + O

  const currentViewInfo = VIEW_CONFIG[activeView] || VIEW_CONFIG["home"];

  return (
    <div className={styles.root_layout}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        onNavigate={handleNavigate}
        activeView={activeView}
      />

      <div className={styles.content}>
        <Header
          path={[activeView]}
          title={currentViewInfo.title}
          icon={currentViewInfo.icon}
          showSearch={currentViewInfo.search}
        />

        <main className={styles.main}>
          {activeView === "home" && ( 
            <HomeView onNavigate={handleNavigate} setFooter={setFooterData} />
          )}

          {activeView === "new-project" && (
            <NewProjectView onNavigate={handleNavigate} setFooter={setFooterData} />
          )}

          {activeView === "open-project" && (
            <OpenProjectView onNavigate={handleNavigate} setFooter={setFooterData} />
          )}

          {activeView === "dashboard" && ( 
            <DashboardView projectId={selectedProjectId} setFooter={setFooterData} />
          )}

          {activeView === "dashboard/geometry-editor" && (
            <GeometryEditorView setFooter={setFooterData} />
          )}
          
          {activeView === "dashboard/boundary-conditions" && (
            // <BoundaryConditionsView setFooter={setFooterData} />
            <BoundaryConditionsView />
          )}
          
          {activeView === "dashboard/reports" && (
          // <ReportsView setFooter={setFooterData} />
            <ReportsView />
          )}

          {activeView === "propellants" && (
            <PropellantsView setFooter={setFooterData} />
          )}
          {activeView === "structural-materials" && (
            <StructuralMaterialsView setFooter={setFooterData} />
          )}
          {activeView === "thermal-materials" && (
            <ThermalMaterialsView setFooter={setFooterData} />
          )}
          {activeView === "commercial-motors" && (
            <CommercialMotorsView setFooter={setFooterData} />
          )}

          {activeView === "documents" && (
            <DocumentsView setFooter={setFooterData} />
          )}
          {activeView === "settings" && (
            <SettingsView setFooter={setFooterData} />
          )}
        </main>

        <Footer {...footerData} />
      </div>

      <ToastContainer />
    </div>
  );
}
