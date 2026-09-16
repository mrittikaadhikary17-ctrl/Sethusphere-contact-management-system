import React from "react";
import { UserRound } from "lucide-react";

export function AvatarPlaceholder({ className = "" }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-[#E5E7EB] text-[#6B7280] ${className}`}>
      <UserRound className="h-1/2 w-1/2" strokeWidth={1.5} />
    </div>
  );
}
