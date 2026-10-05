import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Modal({ title, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousActiveElement = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll(focusableSelector);
    focusable?.[0]?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !focusable?.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop" role="presentation">
      <section
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-modal-title"
      >
        <div className="modal-header">
          <h2 id="dish-modal-title">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            Close
          </button>
        </div>
        {children}
      </section>
    </div>,
    document.body
  );
}