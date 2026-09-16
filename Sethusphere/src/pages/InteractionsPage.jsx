import React, { useState } from "react";
import {
  History,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  Search,
  Filter,
  ArrowRight
} from "lucide-react";
import { useContacts } from "../context/ContactContext";
import { useNavigate } from "react-router-dom";

export function InteractionsPage() {
  const { interactions, setQuickAddType, setActiveContactId } = useContacts();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = interactions.filter((item) => {
    if (filterType !== "All" && item.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.contactName?.toLowerCase().includes(q) ||
        item.contactCompany?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "Call":
        return <Phone className="w-4 h-4 text-[#722F37]" />;
      case "Meeting":
        return <Calendar className="w-4 h-4 text-[#4A6B82]" />;
      case "Email":
        return <Mail className="w-4 h-4 text-[#4E6E55]" />;
      case "Message":
        return <MessageSquare className="w-4 h-4 text-[#C5A059]" />;
      default:
        return <FileText className="w-4 h-4 text-[#757985]" />;
    }
  };

  const handleOpenContact = (contactId) => {
    if (contactId) {
      setActiveContactId(contactId);
      navigate("/contact-profile");
    }
  };

  return (
    <div className="space-y-6">
      {/* 14. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-[#121316]">
              Interactions Timeline
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE8DF] text-[#494C55]">
              {filtered.length} Touchpoints
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#757985] mt-0.5">
            Audit log of all calls, meetings, emails, and touchpoints across the relationship network.
          </p>
        </div>

        <button
          onClick={() => setQuickAddType("interaction")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#722F37] hover:bg-[#5C1521] text-xs font-semibold text-white shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Interaction</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="surface-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#722F37] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions, participants, or outcomes..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F5F2EB] border border-[#E5E0D8] focus:outline-none focus:border-[#722F37]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {["All", "Meeting", "Call", "Email", "Message", "Note"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                filterType === t
                  ? "bg-[#121316] text-white"
                  : "bg-white text-[#757985] border border-[#E5E0D8] hover:text-[#121316]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Interactions Feed */}
      <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5E0D8]">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-6 sm:-left-8 top-3 w-6 h-6 rounded-full bg-white border-2 border-[#121316] shadow-sm flex items-center justify-center">
              {getTypeIcon(item.type)}
            </div>

            <div className="surface-card rounded-2xl p-5 surface-card-hover">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-[#F0ECE1]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F5F2EB] text-[#494C55] border border-[#E5E0D8]">
                      {item.type}
                    </span>
                    <h3 className="text-sm font-bold text-[#121316]">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#757985] mt-1">
                    <span
                      onClick={() => handleOpenContact(item.contactId)}
                      className="font-bold text-[#722F37] hover:underline cursor-pointer"
                    >
                      {item.contactName}
                    </span>
                    <span>•</span>
                    <span>{item.contactCompany}</span>
                    {item.duration && item.duration !== "N/A" && (
                      <>
                        <span>•</span>
                        <span>{item.duration}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 text-xs text-[#9C9FA8] font-medium">
                  {item.date}
                </div>
              </div>

              <p className="text-xs text-[#313339] mt-3 leading-relaxed">
                {item.description}
              </p>

              {item.outcome && (
                <div className="mt-3 pt-2.5 border-t border-[#EDE8DF] text-xs text-[#722F37] bg-[#FBF9F5] p-2.5 rounded-lg border border-[#EBE6DC] flex items-center gap-2">
                  <span className="font-bold shrink-0">Outcome & Follow-up:</span>
                  <span>{item.outcome}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
