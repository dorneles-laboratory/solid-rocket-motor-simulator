import { useState } from "react";
import AppSidebar from "./sidebar/sidebar";
import styles from "./RootLayout.module.css"

import HomeView from "../views/home/HomeView";
import NewProjectView from "../views/new-project/NewProjectView";
import OpenProjectView from "../views/open-project/OpenProjectView";
import PropellantsView from "../views/propellants/PropellantsView";
import DocumentsView from "../views/documents/DocumentsView";
import SettingsView from "../views/settings/SettingsView";

export default function RootLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeView, setActiveView] = useState("home")

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className={styles.root_layout}>
      <AppSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={handleToggleSidebar}
        onNavigate={setActiveView}
        activeView={activeView}
      />
      
      <main className={styles.content}>
        {activeView === "home" && <HomeView />}
        {activeView === "new-project" && <NewProjectView />}
        {activeView === "open-project" && <OpenProjectView />}
        {activeView === "propellants" && <PropellantsView />}
        {activeView === "documents" && <DocumentsView />}
        {activeView === "settings" && <SettingsView />}
      </main>
    </div>
  );
} 