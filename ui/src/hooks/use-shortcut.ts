import { useEffect } from "react";

export function useShortcut(
  key: string, 
  callback: () => void, 
  options: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement) {
        const tagName = activeElement.tagName.toLowerCase();
        if (tagName === "input" || tagName === "textarea" || tagName === "select") {
          return;
        }
      }

      const isCtrlPressed = options.ctrl ? (event.ctrlKey || event.metaKey) : false;
      const isShiftPressed = options.shift ? event.shiftKey : false;
      const isAltPressed = options.alt ? event.altKey : false;

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        isCtrlPressed === !!options.ctrl &&
        isShiftPressed === !!options.shift &&
        isAltPressed === !!options.alt
      ) {
        event.preventDefault(); 
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, options]);
}