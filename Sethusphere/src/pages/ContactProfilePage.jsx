import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  CheckSquare,
  Edit3,
  Globe,
  MapPin,
  Briefcase,
  Share2,
  Sparkles,
  Clock,
  Send,
  Plus,
  ArrowLeft,
  Star,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Trash2
} from "lucide-react";
import { useContacts } from "../context/ContactContext";
import { StatusBadge, CategoryBadge } from "../components/common/StatusBadge";
import { HealthScoreGauge } from "../components/common/HealthScoreGauge";
import { AvatarPlaceholder } from "../components/common/AvatarPlaceholder";

export function ContactProfilePage() {
  const {
    contacts,
    activeContactId,
    setActiveContactId,
    tasks,
    interactions,
    toggleTaskStatus,
    addContactNote,
    updateContactNote,
    deleteContactNote,
    setQuickAddType,
    toggleFavorite,
    showToast,
    deleteInteraction,
    setEditingActivity
  } = useContacts();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'timeline' | 'tasks' | 'notes'
  const [newNoteText, setNewNoteText] = useState("");
  const [isEditingScore, setIsEditingScore] = useState(false);

  // Find the selected contact (default to first contact or cnt-1)
  const contact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  if (!contact) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-[#757985]">No contact selected.</p>
        <Link to="/contacts" className="text-xs font-semibold text-[#722F37] underline mt-2 block">
          Back to Contacts
        </Link>
      </div>
    );
  }

  // Associated interactions
  const contactInteractions = interactions.filter(
    (i) => i.contactId === contact.id || i.contactName === contact.fullName
  );

  // Associated tasks
  const contactTasks = tasks.filter(
    (t) => t.contactId === contact.id || t.contactName === contact.fullName
  );
  const touchpointCount = contactInteractions.length;
  const interactionCadence = (() => {
    const dates = contactInteractions
      .map((item) => new Date(item.timestamp || item.date))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a - b);
    if (dates.length < 2) return "Not enough data";
    const spanDays = Math.max(1, (dates[dates.length - 1] - dates[0]) / 86400000);
    const averageDays = spanDays / (dates.length - 1);
    if (averageDays <= 2) return "Daily";
    if (averageDays <= 9) return "Weekly";
    if (averageDays <= 24) return "Bi-weekly";
    return "Monthly+";
  })();

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addContactNote(contact.id, newNoteText);
    setNewNoteText("");
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb & Quick Selector */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/contacts")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#757985] hover:text-[#121316] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all contacts</span>
        </button>

        {/* Quick Contact Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9C9FA8] hidden sm:inline">Viewing Dossier:</span>
          <select
            value={contact.id}
            onChange={(e) => setActiveContactId(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-[#DCD7CE] text-[#121316] focus:outline-none focus:border-[#722F37]"
          >
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 11. SIGNATURE HEADER CARD */}
      <div className="surface-card rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#722F37]/5 via-[#C5A059]/5 to-transparent rounded-full pointer-events-none blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and Essential Credentials */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              {contact.avatar ? (
                <img src={contact.avatar} alt={contact.fullName} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md" />
              ) : (
                <AvatarPlaceholder className="h-20 w-20 rounded-2xl border-2 border-white shadow-md sm:h-24 sm:w-24" />
              )}
              <button
                onClick={() => toggleFavorite(contact.id)}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-white shadow-md border border-[#EBE6DC] text-[#CACCD2] hover:text-[#C5A059] transition-colors"
              >
                <Star
                  className={`w-4 h-4 ${
                    contact.isFavorite ? "fill-[#C5A059] text-[#C5A059]" : ""
                  }`}
                />
              </button>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-[#121316]">
                  {contact.fullName}
                </h1>
                <CategoryBadge category={contact.category} />
                <StatusBadge status={contact.healthStatus} size="sm" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#757985] mt-1.5 font-medium">
                <span className="text-[#121316] font-semibold">{contact.jobTitle}</span>
                <span>at</span>
                <span className="text-[#722F37] font-semibold">{contact.company}</span>
                <span>•</span>
                <span>Relationship since {contact.relationshipSince}</span>
              </div>

              {/* Tags Cloud */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {contact.tags?.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F5F2EB] text-[#494C55] border border-[#E5E0D8]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => showToast(`Initiating call with ${contact.fullName} (${contact.phone})`, "info")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F2EB] hover:bg-[#EDE8DF] text-xs font-semibold text-[#121316] border border-[#DCD7CE] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#722F37]" />
              <span>Call</span>
            </button>

            <button
              onClick={() => showToast(`Opening compose to ${contact.email}...`, "info")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F2EB] hover:bg-[#EDE8DF] text-xs font-semibold text-[#121316] border border-[#DCD7CE] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#4A6B82]" />
              <span>Email</span>
            </button>

            <button
              onClick={() => showToast(`Opening secure channel to ${contact.fullName}...`, "info")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F2EB] hover:bg-[#EDE8DF] text-xs font-semibold text-[#121316] border border-[#DCD7CE] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#4E6E55]" />
              <span>Message</span>
            </button>

            <button
              onClick={() => setQuickAddType("interaction")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#722F37] hover:bg-[#5C1521] text-xs font-semibold text-white shadow-sm transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Log Interaction</span>
            </button>

            <button
              onClick={() => setQuickAddType("task")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#F5F2EB] text-xs font-semibold text-[#494C55] border border-[#DCD7CE] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Dossier (Intelligence & Info) + Right Activity Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Health Score + Contact Details + Cadence Metrics */}
        <div className="space-y-6">
          {/* 11. RELATIONSHIP HEALTH VISUALIZATION */}
          <div className="surface-card rounded-2xl p-6 text-center relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1] text-left">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#757985]">
                  Relationship Strength
                </h3>
                <span className="text-[11px] text-[#9C9FA8]">Real-time engagement index</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F0EA] text-[#29422F] border border-[#CFDFD2]">
                Active Index
              </span>
            </div>

            <div className="py-6">
              <HealthScoreGauge score={contact.relationshipScore} size="lg" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F0ECE1] text-left text-xs">
              <div className="p-3 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC]">
                <span className="text-[#9C9FA8] block text-[10px] uppercase font-semibold">Last Interaction</span>
                <span className="text-sm font-bold text-[#121316] mt-0.5 block">{contact.lastInteraction}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC]">
                <span className="text-[#9C9FA8] block text-[10px] uppercase font-semibold">Next Follow-up</span>
                <span className={`text-sm font-bold mt-0.5 block ${contact.nextFollowUp?.includes("Overdue") ? "text-[#DC2626]" : "text-[#722F37]"}`}>
                  {contact.nextFollowUp}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC]">
                <span className="text-[#9C9FA8] block text-[10px] uppercase font-semibold">Total Touchpoints</span>
                <span className="text-sm font-bold text-[#121316] mt-0.5 block">{touchpointCount} events</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC]">
                <span className="text-[#9C9FA8] block text-[10px] uppercase font-semibold">Interaction Cadence</span>
                <span className="text-sm font-bold text-[#121316] mt-0.5 block">{interactionCadence}</span>
              </div>
            </div>
          </div>

          {/* 11. CONTACT INFORMATION DOSSIER */}
          <div className="surface-card rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#757985] pb-3 border-b border-[#F0ECE1]">
              Contact Details
            </h3>

            <div className="divide-y divide-[#F0ECE1] text-xs">
              <div className="py-3 flex items-start justify-between">
                <span className="text-[#757985] flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#722F37]" />
                  Work Email
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-semibold text-[#121316] hover:text-[#722F37] truncate max-w-[180px]"
                >
                  {contact.email}
                </a>
              </div>

              <div className="py-3 flex items-start justify-between">
                <span className="text-[#757985] flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#722F37]" />
                  Phone Number
                </span>
                <a
                  href={`tel:${contact.phone}`}
                  className="font-semibold text-[#121316] hover:text-[#722F37]"
                >
                  {contact.phone}
                </a>
              </div>

              <div className="py-3 flex items-start justify-between">
                <span className="text-[#757985] flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#722F37]" />
                  Company & Role
                </span>
                <span className="font-semibold text-[#121316] text-right">
                  {contact.company} • {contact.jobTitle}
                </span>
              </div>

              <div className="py-3 flex items-start justify-between">
                <span className="text-[#757985] flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#722F37]" />
                  Office Address
                </span>
                <span className="font-semibold text-[#121316] text-right max-w-[180px] leading-tight">
                  {contact.address || "New Delhi, India"}
                </span>
              </div>

              <div className="py-3 flex items-start justify-between">
                <span className="text-[#757985] flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#722F37]" />
                  Website
                </span>
                {contact.website ? (
                  <a
                    href={/^https?:\/\//i.test(contact.website) ? contact.website : `https://${contact.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#722F37] hover:underline flex items-center gap-1"
                  >
                    {contact.website.replace(/^https?:\/\//i, "")}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="font-semibold text-[#9C9FA8]">Not provided</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Tabs (Timeline, Notes, Tasks) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Selector */}
          <div className="flex items-center gap-2 border-b border-[#E5E0D8] pb-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-t-xl transition-all ${
                activeTab === "overview"
                  ? "bg-white text-[#722F37] border-b-2 border-[#722F37] shadow-2xs font-bold"
                  : "text-[#757985] hover:text-[#121316]"
              }`}
            >
              Activity Timeline
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-4 py-2 rounded-t-xl transition-all ${
                activeTab === "notes"
                  ? "bg-white text-[#722F37] border-b-2 border-[#722F37] shadow-2xs font-bold"
                  : "text-[#757985] hover:text-[#121316]"
              }`}
            >
              Private Relationship Notes ({contact.notes?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-4 py-2 rounded-t-xl transition-all ${
                activeTab === "tasks"
                  ? "bg-white text-[#722F37] border-b-2 border-[#722F37] shadow-2xs font-bold"
                  : "text-[#757985] hover:text-[#121316]"
              }`}
            >
              Follow-up Tasks ({contactTasks.length})
            </button>
          </div>

          {/* TAB 1: TIMELINE */}
          {activeTab === "overview" && (
            <div className="surface-card rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#121316]">
                    Relationship Audit Trail
                  </h3>
                  <p className="text-xs text-[#757985]">
                    Complete chronological history of calls, emails, and notes.
                  </p>
                </div>
                <button
                  onClick={() => setQuickAddType("interaction")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#722F37] hover:bg-[#5C1521] rounded-lg shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Log Event
                </button>
              </div>

              {contactInteractions.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#757985]">
                  No recent interactions logged for this contact.
                </div>
              ) : (
                <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E0D8]">
                  {contactInteractions.map((act) => (
                    <div key={act.id} className="relative group">
                      <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#121316] text-[#C5A059] border-2 border-white flex items-center justify-center text-[9px] font-bold">
                        {act.type[0]}
                      </div>
                      <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC] group-hover:border-[#DDD4C4] transition-all">
                        <div className="flex items-start justify-between">
                          <div className="text-xs font-bold text-[#121316]">
                            {act.title}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#9C9FA8]">{act.date}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingActivity(act);
                                setQuickAddType("interaction-edit");
                              }}
                              className="text-[#757985] hover:text-[#121316]"
                              title="Edit interaction"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (!window.confirm("Delete this interaction?")) return;
                                try {
                                  await deleteInteraction(act.id);
                                } catch (error) {
                                  showToast(error.message, "error");
                                }
                              }}
                              className="text-[#757985] hover:text-[#B91C1C]"
                              title="Delete interaction"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#494C55] mt-1.5 leading-relaxed">
                          {act.description}
                        </p>
                        {act.outcome && (
                          <div className="mt-2.5 pt-2 border-t border-[#EDE8DF] text-[11px] text-[#722F37] font-medium flex items-center gap-1">
                            <strong>Outcome:</strong> {act.outcome}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: NOTES */}
          {activeTab === "notes" && (
            <div className="surface-card rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-[#121316]">
                  Relationship Observations & Strategy Notes
                </h3>
                <p className="text-xs text-[#757985]">
                  Private context visible only to your strategic account team.
                </p>
              </div>

              {/* Add Note Input */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Record strategic conversation points, family/personal details, or commercial objections..."
                  className="w-full p-3 text-xs rounded-xl border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37] focus:bg-white transition-colors"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#722F37] hover:bg-[#5C1521] rounded-lg shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Save Note
                  </button>
                </div>
              </form>

              {/* Note Cards List */}
              <div className="space-y-3 pt-2">
                {contact.notes?.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC] text-xs"
                  >
                    <div className="flex items-center justify-between text-[#9C9FA8] text-[11px] mb-1.5 font-medium">
                      <span className="font-semibold text-[#121316]">{n.author || "Mrittika Adhikary"}</span>
                      <span>{n.date}</span>
                    </div>
                    <p className="text-[#313339] leading-relaxed">
                      {n.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TASKS */}
          {activeTab === "tasks" && (
            <div className="surface-card rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#121316]">
                    Upcoming Follow-up Commitments
                  </h3>
                  <p className="text-xs text-[#757985]">
                    Scheduled tasks for this contact.
                  </p>
                </div>
                <button
                  onClick={() => setQuickAddType("task")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#722F37] hover:bg-[#5C1521] rounded-lg shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Task
                </button>
              </div>

              {contactTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#757985]">
                  No upcoming follow-ups assigned to this contact.
                </div>
              ) : (
                <div className="divide-y divide-[#F0ECE1]">
                  {contactTasks.map((t) => {
                    const isDone = t.status === "Completed";
                    return (
                      <div
                        key={t.id}
                        className="py-3.5 flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleTaskStatus(t.id)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isDone
                                ? "bg-[#4E6E55] border-[#4E6E55] text-white"
                                : "border-[#DCD7CE] hover:border-[#722F37] bg-white text-transparent"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <div
                              className={`text-xs font-bold transition-colors ${
                                isDone
                                  ? "text-[#4E6E55]"
                                  : "text-[#121316]"
                              }`}
                            >
                              {t.title}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingActivity(t);
                                  setQuickAddType("task-edit");
                                }}
                                className="text-[#757985] hover:text-[#121316]"
                                title="Edit task"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!window.confirm("Delete this task?")) return;
                                  try {
                                    await deleteTask(t.id);
                                  } catch (error) {
                                    showToast(error.message, "error");
                                  }
                                }}
                                className="text-[#757985] hover:text-[#B91C1C]"
                                title="Delete task"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="text-[11px] text-[#757985] mt-0.5">
                              Due: {t.dueDate}
                            </div>
                          </div>
                        </div>

                        <StatusBadge status={t.priority} size="sm" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
