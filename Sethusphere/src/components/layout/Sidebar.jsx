import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  History,
  CheckSquare,
  FolderKanban,
  CopyCheck,
  BarChart3,
  FileSpreadsheet,
  Settings,
  Sparkles,
  ChevronRight,
  LogOut,
  X
} from "lucide-react";
import { useContacts } from "../../context/ContactContext";
import { setAuthToken } from "../../lib/api";
import { UserAvatar } from "../common/UserAvatar";

export function Sidebar({ onCloseMobile, showCloseButton = false }) {
  const { tasks, duplicates, contacts, profile } = useContacts();

  const pendingTasksCount = tasks.filter((t) => t.status === "Pending" || t.status === "Overdue").length;
  const duplicateCount = duplicates.length;
  const needsAttentionCount = contacts.filter((c) => c.healthStatus === "Needs Attention" || c.healthStatus === "At Risk").length;
  const networkHealth = contacts.length
    ? Math.round(contacts.reduce((total, contact) => total + (Number(contact.relationshipScore) || 0), 0) / contacts.length)
    : null;

  const handleLogout = () => {
    setAuthToken(null);
    [
      "sethusphere_profile",
      "sethusphere_contacts",
      "sethusphere_interactions",
      "sethusphere_tasks",
      "sethusphere_groups",
      "sethusphere_tags",
    ].forEach((key) => localStorage.removeItem(key));
    window.location.assign("/signin");
  };

  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: "/contacts",
      label: "Contacts",
      icon: Users,
      badge: contacts.length
    },
    {
      to: "/relationships",
      label: "Relationships",
      icon: HeartHandshake,
      badge: needsAttentionCount > 0 ? `${needsAttentionCount} alert` : null,
      badgeColor: "bg-[#722F37]/20 text-[#ECC7CC] border border-[#722F37]/40"
    },
    {
      to: "/interactions",
      label: "Interactions",
      icon: History,
      badge: null
    },
    {
      to: "/tasks",
      label: "Tasks & Follow-ups",
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeColor: "bg-[#D97736]/20 text-[#F8D2B9] border border-[#D97736]/30"
    },
    {
      to: "/groups",
      label: "Groups & Tags",
      icon: FolderKanban,
      badge: null
    },
    {
      to: "/duplicates",
      label: "Duplicate Detection",
      icon: CopyCheck,
      badge: duplicateCount > 0 ? `${duplicateCount}` : null,
      badgeColor: "bg-[#C5A059]/20 text-[#EEDDB8] border border-[#C5A059]/40"
    },
    {
      to: "/analytics",
      label: "Analytics",
      icon: BarChart3,
      badge: null
    },
    {
      to: "/import-export",
      label: "Import / Export",
      icon: FileSpreadsheet,
      badge: null
    },
    {
      to: "/settings",
      label: "Settings",
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 h-full bg-[#121316] text-[#EDE8DF] flex flex-col border-r border-[#22252E] select-none">
      {/* Brand Header */}
      <div className="relative h-20 px-6 flex items-center border-b border-[#22252E]/80">
        <NavLink
          to="/"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group"
        >
          {/* Abstract Connection Logo Mark */}
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#1C1E26] to-[#0D0E11] border border-[#2E3342] flex items-center justify-center shadow-md group-hover:border-[#722F37] transition-colors">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="6" cy="12" r="2.5" fill="#C5A059" />
              <circle cx="18" cy="7" r="2.5" fill="#8B2635" />
              <circle cx="18" cy="17" r="2.5" fill="#4E6E55" />
              <path
                d="M6 12L18 7M6 12L18 17"
                stroke="#EDE8DF"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm tracking-[0.16em] uppercase text-white">
                SETHUSPHERE
              </span>
            </div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#9C9FA8]">
              Relationship Intelligence
            </span>
          </div>
        </NavLink>
        {showCloseButton && (
          <button
            onClick={onCloseMobile}
            className="absolute top-1 right-1 z-20 rounded-lg p-2 text-[#9C9FA8] hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#757985]">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-[#722F37] text-white shadow-sm font-semibold"
                    : "text-[#CACCD2] hover:bg-[#1C1F28] hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    item.badgeColor || "bg-[#2A2E38] text-[#CACCD2]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Network Pulse Mini Widget */}
      <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-[#1A1C24] border border-[#2A2E38] text-xs">
        <div className="flex items-center justify-between text-[#EDE8DF] font-medium mb-1">
          <span className="flex items-center gap-1.5 text-[11px] text-[#C5A059]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Network Health
          </span>
          <span className="font-bold text-white tabular-nums">{networkHealth === null ? "No data yet" : `${networkHealth}%`}</span>
        </div>
        <div className="w-full h-1.5 bg-[#2A2E38] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4E6E55] via-[#C5A059] to-[#722F37] rounded-full"
            style={{ width: `${networkHealth || 0}%` }}
          />
        </div>
        <span className="block mt-1 text-[10px] text-[#9C9FA8]">
          {needsAttentionCount} contacts require touchpoint
        </span>
      </div>

      {/* User Profile Pill at Bottom */}
      <div className="p-3 border-t border-[#22252E] bg-[#0E0F13]">
        <NavLink
          to="/settings"
          onClick={onCloseMobile}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#1A1C24] transition-colors group"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative">
              <UserAvatar user={profile} className="h-9 w-9 border border-[#2E3342]" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4E6E55] border-2 border-[#121316]" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate group-hover:text-[#EDE8DF]">
                {profile.name}
              </div>
              <div className="text-[11px] text-[#9C9FA8] truncate">
                {profile.title}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#757985] group-hover:text-white transition-transform group-hover:translate-x-0.5" />
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-2 py-2 text-xs font-semibold text-[#CACCD2] transition-colors hover:bg-[#1A1C24] hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
