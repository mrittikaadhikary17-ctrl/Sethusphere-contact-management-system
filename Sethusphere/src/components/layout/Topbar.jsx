import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Bell,
  HelpCircle,
  Menu,
  UserPlus,
  PhoneCall,
  CheckSquare,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContacts } from "../../context/ContactContext";
import { UserAvatar } from "../common/UserAvatar";

export function Topbar({ onOpenMobileMenu }) {
  const { setIsSearchOpen, setQuickAddType, tasks, contacts, profile } = useContacts();
  const [isQuickAddMenuOpen, setIsQuickAddMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const quickAddRef = useRef(null);
  const notifRef = useRef(null);
  const helpRef = useRef(null);
  const navigate = useNavigate();

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (quickAddRef.current && !quickAddRef.current.contains(event.target)) {
        setIsQuickAddMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setIsHelpOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const urgentTasks = tasks.filter((t) => t.priority === "High" && t.status !== "Completed").slice(0, 3);
  const atRiskContacts = contacts.filter((c) => c.healthStatus === "At Risk").slice(0, 2);

  return (
    <header className="h-16 min-w-0 border-b border-[#EBE6DC] bg-[#FFFFFF]/90 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Mobile menu toggle + Global Search trigger */}
      <div className="flex min-w-0 items-center gap-2 lg:gap-6 flex-1 lg:max-w-none">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#494C55] hover:text-[#121316] rounded-lg hover:bg-[#F5F2EB]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="min-w-0 flex-1 flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F5F2EB]/80 border border-[#E5E0D8] text-xs text-[#757985] hover:border-[#DDD4C4] hover:bg-[#EDE8DF]/60 transition-all text-left shadow-2xs group"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Search className="w-4 h-4 text-[#722F37] shrink-0" />
            <span className="truncate group-hover:text-[#121316]">
              Search contacts, companies, interactions, follow-ups...
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-[#6B665E] bg-[#FFFFFF] rounded border border-[#DCD7CE]">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right side: Quick Add, Notifications, Help, User Avatar */}
      <div className="flex shrink-0 items-center gap-1.5 lg:gap-3 ml-2 sm:ml-3">
        {/* Quick Add Menu */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setIsQuickAddMenuOpen(!isQuickAddMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#722F37] hover:bg-[#5C1521] rounded-xl transition-all shadow-sm active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {isQuickAddMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] rounded-xl shadow-xl border border-[#E5E0D8] py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#757985] border-b border-[#F0ECE1]">
                Create New Action
              </div>
              <button
                onClick={() => {
                  setIsQuickAddMenuOpen(false);
                  setQuickAddType("contact");
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#1E2024] hover:bg-[#F5F2EB] text-left transition-colors font-medium"
              >
                <div className="w-7 h-7 rounded-lg bg-[#722F37]/10 text-[#722F37] flex items-center justify-center">
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-[#121316]">Add Contact</div>
                  <div className="text-[10px] text-[#757985]">New network profile</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickAddMenuOpen(false);
                  setQuickAddType("interaction");
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#1E2024] hover:bg-[#F5F2EB] text-left transition-colors font-medium"
              >
                <div className="w-7 h-7 rounded-lg bg-[#4A6B82]/10 text-[#4A6B82] flex items-center justify-center">
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-[#121316]">Log Interaction</div>
                  <div className="text-[10px] text-[#757985]">Call, meeting, note</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickAddMenuOpen(false);
                  setQuickAddType("task");
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#1E2024] hover:bg-[#F5F2EB] text-left transition-colors font-medium"
              >
                <div className="w-7 h-7 rounded-lg bg-[#D97736]/10 text-[#D97736] flex items-center justify-center">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-[#121316]">Create Task</div>
                  <div className="text-[10px] text-[#757985]">Scheduled follow-up</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-[#494C55] hover:text-[#121316] rounded-xl hover:bg-[#F5F2EB] relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {(urgentTasks.length > 0 || atRiskContacts.length > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#722F37] ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5E0D8] p-3 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1] px-1">
                <span className="text-xs font-bold text-[#121316]">
                  Relationship Alerts
                </span>
                <span className="text-[11px] text-[#722F37] font-semibold cursor-pointer" onClick={() => navigate("/tasks")}>
                  View all tasks
                </span>
              </div>

              <div className="divide-y divide-[#F0ECE1] max-h-72 overflow-y-auto mt-1">
                {urgentTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      navigate("/tasks");
                    }}
                    className="py-2.5 px-2 hover:bg-[#F5F2EB] rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#D97736] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-[#121316] leading-tight">
                          {t.title}
                        </div>
                        <div className="text-[11px] text-[#757985] mt-0.5">
                          Due: {t.dueDate} • {t.contactName}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {atRiskContacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      navigate("/relationships");
                    }}
                    className="py-2.5 px-2 hover:bg-[#FDF2F2] rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-[#991B1B] leading-tight">
                          Health score decay: {c.fullName}
                        </div>
                        <div className="text-[11px] text-[#757985] mt-0.5">
                          Score {c.relationshipScore}/100 • No contact in {c.lastInteraction}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Flyout */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="p-2 text-[#494C55] hover:text-[#121316] rounded-xl hover:bg-[#F5F2EB] transition-colors"
            aria-label="Help and Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {isHelpOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5E0D8] p-4 z-40 text-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#121316] mb-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                Sethusphere Guidance
              </div>
              <p className="text-[11px] text-[#757985] mb-3 leading-relaxed">
                Smart relationship management engineered for meaningful follow-ups and network longevity.
              </p>
              <div className="space-y-1.5 text-[11px] border-t border-[#F0ECE1] pt-2 text-[#494C55]">
                <div className="flex justify-between">
                  <span>Global Search</span>
                  <kbd className="px-1.5 bg-[#EDE8DF] rounded text-[10px]">⌘K</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Quick Add Contact</span>
                  <kbd className="px-1.5 bg-[#EDE8DF] rounded text-[10px]">C</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Log Interaction</span>
                  <kbd className="px-1.5 bg-[#EDE8DF] rounded text-[10px]">I</kbd>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <Link
          to="/settings"
          className="flex items-center gap-2 pl-2 border-l border-[#EBE6DC] hover:opacity-90 transition-opacity"
        >
          <UserAvatar user={profile} className="h-8 w-8 border border-[#DCD7CE]" />
        </Link>
      </div>
    </header>
  );
}
