import { useState } from "react";
import styles from "./RootLayout.module.css"
import Sidebar from "./sidebar/sidebar";
import Header from "./header/header";

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
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={handleToggleSidebar}
        onNavigate={setActiveView}
        activeView={activeView}
      />
      
      <div className={styles.content}>
        <Header path={[activeView]} />

        <main className={styles.main}>
          {activeView === "home" && <HomeView />}
          {activeView === "new-project" && <NewProjectView />}
          {activeView === "open-project" && <OpenProjectView />}
          {activeView === "propellants" && <PropellantsView />}
          {activeView === "documents" && <DocumentsView />}
          {activeView === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
} 