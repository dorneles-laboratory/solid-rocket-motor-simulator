import { useEffect, useState } from "react";
import { Toast, ToastType } from "./toast";
import styles from "./toast-container.module.css";

interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleAddToast = (e: Event) => {
      const customEvent = e as CustomEvent<Omit<ToastMessage, "id">>;

      const newToast = {
        ...customEvent.detail,
        id: Math.random().toString(36).substring(2, 9),
        duration: customEvent.detail.duration || 4000,
      };

      setToasts((prev) => [...prev, newToast]);
    };

    window.addEventListener("add-toast", handleAddToast);

    return () => {
      window.removeEventListener("add-toast", handleAddToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "2rem",
        right: "2rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: "auto" }}>
          <AutoDismissToast
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}

// Subcomponente atualizado com animação
function AutoDismissToast({
  toast,
  onRemove,
}: {
  toast: ToastMessage;
  onRemove: () => void;
}) {
  const [isLeaving, setIsLeaving] = useState(false);

  // Função que engatilha a animação e depois remove o componente
  const handleClose = () => {
    setIsLeaving(true);
    // Aguarda o tempo exato da animação CSS (300ms) antes de desmontar
    setTimeout(() => {
      onRemove();
    }, 300);
  };

  useEffect(() => {
    // Inicia o processo de fechamento automático após o duration
    const timer = setTimeout(() => {
      handleClose();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration]); // Removi a dependência direta do onRemove para evitar re-renders

  return (
    <div className={isLeaving ? styles.toastExit : styles.toastEnter}>
      <Toast
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={handleClose} // Passamos o handleClose no lugar do onRemove direto
      />
    </div>
  );
}

export const showToast = (toast: Omit<ToastMessage, "id">) => {
  const event = new CustomEvent("add-toast", { detail: toast });
  window.dispatchEvent(event);
};
