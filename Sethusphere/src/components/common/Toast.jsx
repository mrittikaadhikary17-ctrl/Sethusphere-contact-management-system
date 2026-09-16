import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useContacts } from "../../context/ContactContext";

export function Toast() {
  const { toast, hideToast } = useContacts();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-[#4E6E55] shrink-0" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-[#722F37] shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm w-full">
      <div className="bg-[#121316] text-[#FBF9F5] rounded-xl shadow-2xl border border-[#2A2E38] p-4 flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 text-sm font-medium text-[#EDE8DF]">
          {toast.message}
        </div>
        <button
          onClick={hideToast}
          className="text-[#9C9FA8] hover:text-[#FBF9F5] transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
