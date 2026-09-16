import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartHandshake,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  ShieldAlert,
  Search,
  CheckCircle2
} from "lucide-react";
import { useContacts } from "../context/ContactContext";
import { StatusBadge, CategoryBadge } from "../components/common/StatusBadge";
import { HealthScoreGauge } from "../components/common/HealthScoreGauge";
import { AvatarPlaceholder } from "../components/common/AvatarPlaceholder";

export function RelationshipsPage() {
  const { contacts, setActiveContactId, showToast } = useContacts();
  const navigate = useNavigate();

  const [activeTier, setActiveTier] = useState("All"); // 'All' | 'Healthy' | 'Needs Attention' | 'At Risk' | 'Inactive'
  const [searchTerm, setSearchTerm] = useState("");

  const healthyContacts = contacts.filter((c) => c.healthStatus === "Healthy");
  const attentionContacts = contacts.filter((c) => c.healthStatus === "Needs Attention");
  const atRiskContacts = contacts.filter((c) => c.healthStatus === "At Risk");
  const inactiveContacts = contacts.filter((c) => c.healthStatus === "Inactive");
  const portfolioHealth = contacts.length
    ? Math.round(contacts.reduce((sum, contact) => sum + Number(contact.relationshipScore || 0), 0) / contacts.length)
    : null;
  const alertContacts = atRiskContacts.slice(0, 2);

  const displayedContacts = contacts.filter((c) => {
    if (activeTier !== "All" && c.healthStatus !== activeTier) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.jobTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenContact = (id) => {
    setActiveContactId(id);
    navigate("/contact-profile");
  };

  return (
    <div className="space-y-6">
      {/* 13. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-[#121316]">
              Relationship Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#722F37]/10 text-[#722F37] border border-[#722F37]/20">
              Decay Prevention
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#757985] mt-0.5">
            Monitor network vitality, prevent account decay, and identify high-leverage re-engagement windows.
          </p>
        </div>
      </div>

      {/* 13. RELATIONSHIP OVERVIEW VISUALIZATION AT TOP */}
      <div className="surface-card rounded-2xl p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#F0ECE1]">
          <div className="max-w-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#757985]">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              Portfolio Health Index
            </div>
            <div className="mt-2 text-3xl font-bold text-[#121316] font-sans">
              {portfolioHealth === null ? "No data yet" : portfolioHealth}
              {portfolioHealth !== null && <span className="text-sm font-semibold text-[#4E6E55]"> / 100</span>}
            </div>
            <p className="text-xs text-[#757985] mt-1 leading-relaxed">
              Based on communication cadence, responsiveness rate, interaction recency, and follow-up reliability across {contacts.length} accounts.
            </p>
          </div>

          {/* 4 Interactive Tier Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            <button
              onClick={() => setActiveTier(activeTier === "Healthy" ? "All" : "Healthy")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeTier === "Healthy"
                  ? "bg-[#E8F0EA] border-[#4E6E55] ring-2 ring-[#4E6E55]/20"
                  : "bg-[#FBF9F5] border-[#EBE6DC] hover:border-[#DDD4C4]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#29422F]">Healthy</span>
                <span className="block w-2.5 h-2.5 min-w-2.5 rounded-full aspect-square shrink-0 bg-[#4E6E55]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#121316] tabular-nums">
                {healthyContacts.length}
              </div>
              <div className="text-[11px] text-[#4E6E55] font-medium">85–100 Score</div>
            </button>

            <button
              onClick={() => setActiveTier(activeTier === "Needs Attention" ? "All" : "Needs Attention")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeTier === "Needs Attention"
                  ? "bg-[#FEF3EB] border-[#D97736] ring-2 ring-[#D97736]/20"
                  : "bg-[#FBF9F5] border-[#EBE6DC] hover:border-[#DDD4C4]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#873812]">Attention</span>
                <span className="block w-2.5 h-2.5 min-w-2.5 rounded-full aspect-square shrink-0 bg-[#D97736]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#121316] tabular-nums">
                {attentionContacts.length}
              </div>
              <div className="text-[11px] text-[#A24A1B] font-medium">60–84 Score</div>
            </button>

            <button
              onClick={() => setActiveTier(activeTier === "At Risk" ? "All" : "At Risk")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeTier === "At Risk"
                  ? "bg-[#FDF7F8] border-[#722F37] ring-2 ring-[#722F37]/20"
                  : "bg-[#FBF9F5] border-[#EBE6DC] hover:border-[#DDD4C4]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#722F37]">At Risk</span>
                <span className="block w-2.5 h-2.5 min-w-2.5 rounded-full aspect-square shrink-0 bg-[#8B2635]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#121316] tabular-nums">
                {atRiskContacts.length}
              </div>
              <div className="text-[11px] text-[#8B2635] font-medium">30–59 Score</div>
            </button>

            <button
              onClick={() => setActiveTier(activeTier === "Inactive" ? "All" : "Inactive")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeTier === "Inactive"
                  ? "bg-[#EDE8DF] border-[#9C9FA8] ring-2 ring-[#9C9FA8]/20"
                  : "bg-[#FBF9F5] border-[#EBE6DC] hover:border-[#DDD4C4]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#494C55]">Inactive</span>
                <span className="block w-2.5 h-2.5 min-w-2.5 rounded-full aspect-square shrink-0 bg-[#9C9FA8]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#121316] tabular-nums">
                {inactiveContacts.length}
              </div>
              <div className="text-[11px] text-[#757985] font-medium">&lt;30 Score</div>
            </button>
          </div>
        </div>

        {/* Decay Alert Callout Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#FEF3EB] border border-[#F8D2B9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#873812]">
            <AlertTriangle className="w-4 h-4 text-[#D97736] shrink-0" />
            <span>
              <strong>{alertContacts.length ? "Re-engagement Recommended:" : "No re-engagement alerts yet."}</strong>
              {alertContacts.length > 0 && ` ${alertContacts.map((contact) => contact.fullName).join(" and ")} ${alertContacts.length === 1 ? "has" : "have"} an at-risk relationship score.`}
            </span>
          </div>
          <button
            onClick={() => setActiveTier("At Risk")}
            className="px-3 py-1 rounded-lg bg-white border border-[#F8D2B9] text-[#873812] font-semibold hover:bg-[#FDF7F8] transition-colors shrink-0"
          >
            Review At-Risk
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#722F37] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by contact or company name..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#DCD7CE] focus:outline-none focus:border-[#722F37]"
          />
        </div>

        <div className="text-xs text-[#757985]">
          Showing <strong>{displayedContacts.length}</strong> relationships in {activeTier === "All" ? "all health tiers" : `${activeTier} tier`}
        </div>
      </div>

      {/* Relationships Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedContacts.map((c) => (
          <div
            key={c.id}
            onClick={() => handleOpenContact(c.id)}
            className="surface-card rounded-2xl p-5 surface-card-hover cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={c.fullName}
                      className="w-12 h-12 min-w-12 rounded-full object-cover border border-[#DCD7CE]"
                    />
                  ) : (
                    <AvatarPlaceholder className="h-12 w-12 min-w-12 border border-[#DCD7CE]" />
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[#121316] group-hover:text-[#722F37] transition-colors flex flex-wrap items-center gap-2">
                      <span className="break-words">{c.fullName}</span>
                      <CategoryBadge category={c.category} />
                    </div>
                    <div className="text-xs text-[#494C55] font-medium mt-0.5">
                      {c.jobTitle} • <strong className="text-[#121316]">{c.company}</strong>
                    </div>
                  </div>
                </div>

                <HealthScoreGauge score={c.relationshipScore} size="sm" />
              </div>

              {/* Cadence Metrics Bar */}
              <div className="mt-4 grid grid-cols-2 gap-2 p-3 bg-[#FBF9F5] rounded-xl border border-[#EBE6DC] text-xs">
                <div>
                  <span className="text-[#9C9FA8] text-[10px] uppercase font-semibold block">Last Interaction</span>
                  <span className="font-semibold text-[#121316] mt-0.5 block">{c.lastInteraction}</span>
                </div>
                <div>
                  <span className="text-[#9C9FA8] text-[10px] uppercase font-semibold block">Next Follow-up</span>
                  <span className={`font-semibold mt-0.5 block ${c.nextFollowUp?.includes("Overdue") ? "text-[#DC2626]" : "text-[#722F37]"}`}>
                    {c.nextFollowUp}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
              <StatusBadge status={c.healthStatus} size="sm" />

              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => showToast(`Calling ${c.fullName}...`, "info")}
                  className="p-1.5 rounded-lg hover:bg-[#EDE8DF] text-[#494C55] transition-colors"
                  title="Call"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => showToast(`Composing email to ${c.email}...`, "info")}
                  className="p-1.5 rounded-lg hover:bg-[#EDE8DF] text-[#494C55] transition-colors"
                  title="Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenContact(c.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#722F37]/10 text-[#722F37] font-semibold text-[11px] hover:bg-[#722F37] hover:text-white transition-colors"
                >
                  <span>Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
