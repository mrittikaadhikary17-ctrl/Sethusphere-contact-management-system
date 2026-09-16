import React, { useState, useEffect, useRef } from "react";
import { Search, User, Building, Calendar, CheckSquare, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContacts } from "../../context/ContactContext";
import { StatusBadge } from "./StatusBadge";

export function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    contacts,
    tasks,
    interactions,
    setActiveContactId
  } = useContacts();

  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Handle Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  // Search contacts
  const matchedContacts = contacts.filter((c) => {
    if (!q) return true;
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.jobTitle.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }).slice(0, 4);

  // Search tasks
  const matchedTasks = tasks.filter((t) => {
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.contactName?.toLowerCase().includes(q) ||
      t.contactCompany?.toLowerCase().includes(q)
    );
  }).slice(0, 3);

  // Search interactions
  const matchedInteractions = interactions.filter((i) => {
    if (!q) return true;
    return (
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.contactName?.toLowerCase().includes(q)
    );
  }).slice(0, 3);

  const handleSelectContact = (contactId) => {
    setActiveContactId(contactId);
    setIsSearchOpen(false);
    navigate("/contact-profile");
  };

  const handleSelectTask = () => {
    setIsSearchOpen(false);
    navigate("/tasks");
  };

  const handleSelectInteraction = () => {
    setIsSearchOpen(false);
    navigate("/interactions");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#121316]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#DCD7CE] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#EDE8DF] bg-[#FBF9F5] gap-3">
          <Search className="w-5 h-5 text-[#722F37] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts, companies, interactions, follow-ups..."
            className="flex-1 bg-transparent border-none text-sm lg:text-base text-[#121316] placeholder-[#9C9FA8] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#9C9FA8] hover:text-[#121316] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-[#757985] bg-[#EDE8DF] rounded border border-[#DCD7CE]">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-5">
          {/* Contacts & Companies */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#757985] px-2 mb-2">
              <span>Contacts & Companies</span>
              <span>{matchedContacts.length} results</span>
            </div>
            {matchedContacts.length === 0 ? (
              <p className="text-xs text-[#9C9FA8] px-2 py-1">No contacts found</p>
            ) : (
              <div className="space-y-1">
                {matchedContacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectContact(c.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F5F2EB] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar}
                        alt={c.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-[#EDE8DF]"
                      />
                      <div>
                        <div className="text-sm font-semibold text-[#121316] flex items-center gap-2">
                          {c.fullName}
                          <StatusBadge status={c.healthStatus} size="sm" />
                        </div>
                        <div className="text-xs text-[#757985] flex items-center gap-1.5 mt-0.5">
                          <span>{c.jobTitle}</span>
                          <span>•</span>
                          <span className="font-medium text-[#494C55]">{c.company}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9C9FA8] group-hover:text-[#722F37] transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Follow-up Tasks */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#757985] px-2 mb-2">
              <span>Tasks & Follow-ups</span>
              <span>{matchedTasks.length}</span>
            </div>
            {matchedTasks.length === 0 ? (
              <p className="text-xs text-[#9C9FA8] px-2 py-1">No tasks matching</p>
            ) : (
              <div className="space-y-1">
                {matchedTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={handleSelectTask}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F5F2EB] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FEF3EB] text-[#A24A1B] flex items-center justify-center shrink-0">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#121316]">
                          {t.title}
                        </div>
                        <div className="text-xs text-[#757985]">
                          Due: {t.dueDate} • For {t.contactName}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={t.priority} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactions */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#757985] px-2 mb-2">
              <span>Recent Interactions</span>
              <span>{matchedInteractions.length}</span>
            </div>
            {matchedInteractions.length === 0 ? (
              <p className="text-xs text-[#9C9FA8] px-2 py-1">No interactions found</p>
            ) : (
              <div className="space-y-1">
                {matchedInteractions.map((i) => (
                  <div
                    key={i.id}
                    onClick={handleSelectInteraction}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F5F2EB] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#EBF1F5] text-[#2B4B64] flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#121316]">
                          {i.title}
                        </div>
                        <div className="text-xs text-[#757985]">
                          {i.type} with {i.contactName} ({i.date})
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9C9FA8] group-hover:text-[#722F37] transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-[#EDE8DF] bg-[#FBF9F5] text-xs text-[#757985] flex items-center justify-between">
          <span className="inline-flex items-center gap-1">Tip: Press <kbd className="px-1.5 py-0.5 bg-[#EDE8DF] rounded text-[10px] font-semibold text-[#121316]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-[#EDE8DF] rounded text-[10px] font-semibold text-[#121316]">↓</kbd> to navigate or <kbd className="px-1.5 py-0.5 bg-[#EDE8DF] rounded text-[10px] font-semibold text-[#121316]">Esc</kbd> to close</span>
          <span className="font-semibold text-[#722F37]">SETHUSPHERE Network Intelligence</span>
        </div>
      </div>
    </div>
  );
}
