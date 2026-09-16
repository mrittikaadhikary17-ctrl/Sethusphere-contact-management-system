import React from "react";
import { FolderSearch, Plus } from "lucide-react";

export function EmptyState({
  icon: Icon = FolderSearch,
  title = "No records found",
  description = "There are no entries matching your current filter criteria.",
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 surface-card rounded-xl border border-dashed border-[#DCD7CE] my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#EDE8DF]/60 flex items-center justify-center text-[#722F37] mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-[#121316] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[#757985] max-w-sm mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#722F37] text-white hover:bg-[#5C1521] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
