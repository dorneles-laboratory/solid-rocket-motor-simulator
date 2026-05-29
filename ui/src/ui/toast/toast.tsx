import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import styles from './toast.module.css';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  type: ToastType;
  title: string;
  message: string;
  onClose?: () => void;
}

const toastConfig = {
  info: { icon: Info, className: styles.info },
  success: { icon: CheckCircle2, className: styles.success },
  warning: { icon: AlertTriangle, className: styles.warning },
  error: { icon: AlertCircle, className: styles.error },
};

export function Toast({ type, title, message, onClose }: ToastProps) {
  const { icon: Icon, className } = toastConfig[type];

  return (
    <div className={`${styles.toast} ${className}`}>
      {/* Container branco do Ícone */}
      <div className={styles.iconWrapper}>
        <Icon className={styles.icon} strokeWidth={2} size={18} />
      </div>
      
      {/* Textos */}
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{message}</p>
      </div>

      {/* Botão de Fechar */}
      {onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar notificação">
          <X size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}