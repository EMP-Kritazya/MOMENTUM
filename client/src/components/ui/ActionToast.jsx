import { useEffect } from "react";

export default function ActionToast({ message, onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 rounded-xl border border-momentum-lime/40 bg-momentum-panel px-5 py-3 text-sm font-semibold text-white shadow-2xl"
    >
      {message}
    </div>
  );
}
