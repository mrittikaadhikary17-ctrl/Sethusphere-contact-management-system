import React from "react";
import { AvatarPlaceholder } from "./AvatarPlaceholder";

export function UserAvatar({ user, className = "" }) {
  const name = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  if (user?.avatar || user?.profilePhoto) {
    return <img src={user.avatar || user.profilePhoto} alt={name || "User avatar"} className={`rounded-full object-cover ${className}`} />;
  }
  if (initials) {
    return <div className={`flex items-center justify-center rounded-full bg-[#E5E7EB] text-sm font-semibold text-[#6B7280] ${className}`}>{initials}</div>;
  }
  return <AvatarPlaceholder className={className} />;
}
