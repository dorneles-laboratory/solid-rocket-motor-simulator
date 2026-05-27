import styles from './doc-sidebar.module.css';
import NavGroup from './doc-sidebar-group';
import NavItem from './doc-sidebar-item';
import { BookText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface DocumentsSidebarProps {
  onNavigate: (view: string) => void
  activeView: string
}

interface SidebarItem {
  slug: string;
  title: string;
  group: string;
}

// Mock de dados para o sidebar, dados para uso durante desenvolvimento web.
const MOCK_SIDEBAR: SidebarItem[] = [
  { slug: 'getting-started', title: 'Início', group: 'Começando' },
  { slug: 'equations', title: 'Equações de Desempenho do Motor', group: 'Equações' },
];

export default function DocumentsSidebar({ activeView, onNavigate }: DocumentsSidebarProps) {
  const [menuItems, setMenuItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

    if (isTauri) {
      invoke<SidebarItem[]>('list_documents')
        .then(setMenuItems)
        .catch(console.error);
    } else {
      // Navegador
      setMenuItems(MOCK_SIDEBAR);
    }
  }, []);

  // Agrupa os itens por categoria (group) de forma automática
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);
  
  return (
     <aside className={styles.sidebar}>
      {/* Navigation Groups */}
      <nav className={styles.navigation}>

        {/* Renderiza os grupos e seus respectivos itens dinamicamente */}
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <NavGroup key={groupName} title={groupName}>
            {items.map((item) => (
              <NavItem
                key={item.slug}
                icon={<BookText className={styles.icon} strokeWidth={1.5} />}
                label={item.title}
                onClick={() => onNavigate(item.slug)}
                active={activeView === item.slug}
              />
            ))}
          </NavGroup>
        ))}
      </nav>
    </aside>
  )
}