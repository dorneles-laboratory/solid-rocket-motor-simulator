import styles from "./header.module.css"

interface HeaderProps {
  path: string[]
}

export default function Header({ path }: HeaderProps) {
  return (
    <header className={styles.header}>
      <p className={styles.header_text}>
        {path ? path : "home"}
      </p>
    </header>
  )
}