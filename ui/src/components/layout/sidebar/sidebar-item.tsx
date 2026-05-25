import styles from "./sidebar-item.module.css"
import { Tooltip, TooltipTrigger, TooltipContent } from "../../../ui/tooltip"

interface NavItemProps {
  icon: React.ReactNode
  label: string
  collapsed: boolean
  onClick?: () => void
  active?: boolean
  indent?: boolean
  disabled?: boolean
}

export default function NavItem({
  icon,
  label,
  collapsed,
  onClick,
  active,
  indent,
  disabled
}: NavItemProps) {
  const buttonClassName = [
    styles.navItem,
    collapsed && styles.navItemCollapsed,
    indent && !collapsed && styles.navItemIndented,
    active && styles.navItemActive,
  ]
    .filter(Boolean)
    .join(" ");

  const button = (
    <button onClick={onClick} className={buttonClassName} disabled={disabled}>
      <span className={styles.navItemIcon}>
        {icon}
      </span>

      {!collapsed && (
        <span className={styles.navItemLabel}>
          {label}
        </span>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>

        <TooltipContent
          side="right"
          className={styles.tooltipContent}
        >
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}