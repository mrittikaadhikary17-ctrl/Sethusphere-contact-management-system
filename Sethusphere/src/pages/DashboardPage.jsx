import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  HeartHandshake,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ChevronRight,
  Plus,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
  PhoneCall,
  UserPlus
} from "lucide-react";
import { useContacts } from "../context/ContactContext";
import { MetricCard } from "../components/common/MetricCard";
import { StatusBadge, CategoryBadge } from "../components/common/StatusBadge";
import { HealthScoreGauge } from "../components/common/HealthScoreGauge";
import { AvatarPlaceholder } from "../components/common/AvatarPlaceholder";

export function DashboardPage() {
  const {
    contacts,
    tasks,
    interactions,
    setActiveContactId,
    setQuickAddType,
    showToast,
    toggleTaskStatus,
    profile
  } = useContacts();

  const navigate = useNavigate();
  const [pulseView, setPulseView] = useState("distribution"); // 'distribution' | 'timeline'

  // Metric computations
  const totalContacts = contacts.length;
  const healthyCount = contacts.filter((c) => c.healthStatus === "Healthy").length;
  const attentionCount = contacts.filter((c) => c.healthStatus === "Needs Attention").length;
  const atRiskCount = contacts.filter((c) => c.healthStatus === "At Risk").length;
  const inactiveCount = contacts.filter((c) => c.healthStatus === "Inactive").length;

  const activeRelationshipsCount = healthyCount + attentionCount;
  const pendingTasks = tasks.filter((t) => t.status === "Pending" || t.status === "Overdue");
  const dueTodayTasksCount = tasks.filter((t) => String(t.dueDate || "").toLowerCase().includes("today")).length;
  const networkHealth = totalContacts
    ? Math.round(contacts.reduce((sum, contact) => sum + Number(contact.relationshipScore || 0), 0) / totalContacts)
    : null;
  const greeting = (() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  })();

  // Contacts needing attention (sort by lowest score first among non-inactive)
  const contactsNeedingAttention = contacts
    .filter((c) => c.healthStatus === "Needs Attention" || c.healthStatus === "At Risk")
    .slice(0, 4);

  // Priority Contacts (VIPs and top healthy)
  const priorityContacts = contacts
    .filter((c) => c.category === "VIP" || c.isFavorite)
    .slice(0, 3);

  // Recent Activity Feed
  const recentActivities = interactions.slice(0, 5);

  const handleOpenContact = (contactId) => {
    setActiveContactId(contactId);
    navigate("/contact-profile");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 8. Top Hero Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#121316] text-[#EDE8DF] p-6 lg:p-7 shadow-lg border border-[#22252E]">
        {/* Abstract subtle brand accent watermark */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-radial from-[#722F37]/35 via-[#C5A059]/10 to-transparent pointer-events-none blur-2xl" />
        <div className="absolute right-3 top-3 hidden h-28 w-28 items-center justify-center pointer-events-none sm:flex sm:right-6 sm:top-1/2 sm:h-40 sm:w-40 sm:-translate-y-1/2 lg:right-6 lg:h-64 lg:w-64">
          <div className="absolute h-20 w-20 rounded-full bg-[#722F37]/35 blur-3xl sm:h-28 sm:w-28 lg:h-52 lg:w-52" />
          <svg
            className="relative z-10 h-24 w-24 shrink-0 opacity-65 drop-shadow-[0_0_24px_rgba(197,160,89,0.32)] sm:h-32 sm:w-32 lg:h-52 lg:w-52"
            viewBox="0 0 120 120"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="sethusphere-gold-node" cx="32%" cy="28%" r="75%">
                <stop offset="0%" stopColor="#F4D98B" />
                <stop offset="45%" stopColor="#C5A059" />
                <stop offset="100%" stopColor="#8C6D27" />
              </radialGradient>
              <radialGradient id="sethusphere-wine-node" cx="32%" cy="28%" r="75%">
                <stop offset="0%" stopColor="#D98992" />
                <stop offset="45%" stopColor="#8B2635" />
                <stop offset="100%" stopColor="#4D1420" />
              </radialGradient>
              <radialGradient id="sethusphere-sage-node" cx="32%" cy="28%" r="75%">
                <stop offset="0%" stopColor="#A7C7AD" />
                <stop offset="45%" stopColor="#4E6E55" />
                <stop offset="100%" stopColor="#29422F" />
              </radialGradient>
              <filter id="sethusphere-ball-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="1.6" result="blur" />
                <feFlood floodColor="#EEDDB8" floodOpacity="0.34" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="30" cy="60" r="11" fill="url(#sethusphere-gold-node)" filter="url(#sethusphere-ball-glow)" />
            <circle cx="90" cy="30" r="11" fill="url(#sethusphere-wine-node)" filter="url(#sethusphere-ball-glow)" />
            <circle cx="90" cy="90" r="11" fill="url(#sethusphere-sage-node)" filter="url(#sethusphere-ball-glow)" />
            <path d="M30 60L90 30M30 60L90 90" stroke="#EDE8DF" strokeOpacity="0.88" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-2xl border border-[#2F3442] bg-gradient-to-br from-[#1C1E26] to-[#0D0E11] shadow-md">
              <svg className="absolute inset-0 m-auto h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="12" r="2.5" fill="#C5A059" />
                <circle cx="18" cy="7" r="2.5" fill="#8B2635" />
                <circle cx="18" cy="17" r="2.5" fill="#4E6E55" />
                <path d="M6 12L18 7M6 12L18 17" stroke="#EDE8DF" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1C1F28] border border-[#2F3442] text-[11px] font-semibold text-[#C5A059]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Executive Relationship Intelligence</span>
            </div>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold font-sans tracking-tight text-white mb-1.5">
            {greeting}, {profile.firstName || profile.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#CACCD2] font-normal leading-relaxed">
            Stay connected. Know your relationships. Never miss an important follow-up.
          </p>

          {/* Quick Stat Pill Bar */}
          <div className="mt-4 pt-4 border-t border-[#262932] flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4E6E55]" />
              <span className="text-[#9C9FA8]">Network Health:</span>
              <span className="font-semibold text-white">
                {networkHealth === null ? "No data yet" : `${networkHealth}%`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D97736]" />
              <span className="text-[#9C9FA8]">Immediate Actions:</span>
              <span className="font-semibold text-white">{dueTodayTasksCount} follow-ups today</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#722F37]" />
              <span className="text-[#9C9FA8]">Decay Warning:</span>
              <span className="font-semibold text-[#ECC7CC]">{atRiskCount} at-risk contacts</span>
            </div>
          </div>
        </div>
      </div>

      {/* 9A. Key Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-4">
        <MetricCard
          title="Total Contacts"
          value={totalContacts}
          icon={Users}
          onClick={() => navigate("/contacts")}
        />
        <MetricCard
          title="Active Relationships"
          value={activeRelationshipsCount}
          variant="sage"
          icon={HeartHandshake}
          onClick={() => navigate("/relationships")}
        />
        <MetricCard
          title="Follow-ups Due"
          value={pendingTasks.length}
          badgeText={dueTodayTasksCount > 0 ? `${dueTodayTasksCount} due today` : null}
          subtitle="Scheduled across key accounts"
          icon={Clock}
          variant="gold"
          onClick={() => navigate("/tasks")}
        />
        <MetricCard
          title="At-Risk Relationships"
          value={atRiskCount}
          variant="wine"
          icon={AlertTriangle}
          onClick={() => navigate("/relationships")}
        />
      </div>

      {/* 9B. Relationship Pulse & Quick Actions Row */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Relationship Pulse Chart Card (2 cols) */}
        <div className="lg:col-span-2 surface-card rounded-2xl p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0ECE1]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#121316]">
                  Relationship Pulse
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F0EA] text-[#29422F] border border-[#CFDFD2]">
                  Live Intelligence
                </span>
              </div>
              <p className="text-xs text-[#757985] mt-0.5">
                Health distribution and touchpoint frequency across your portfolio.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-[#F5F2EB] rounded-lg border border-[#E5E0D8] text-xs font-semibold">
              <button
                onClick={() => setPulseView("distribution")}
                className={`px-3 py-1 rounded-md transition-all ${
                  pulseView === "distribution"
                    ? "bg-white text-[#121316] shadow-xs"
                    : "text-[#757985] hover:text-[#121316]"
                }`}
              >
                Health Tiers
              </button>
              <button
                onClick={() => setPulseView("timeline")}
                className={`px-3 py-1 rounded-md transition-all ${
                  pulseView === "timeline"
                    ? "bg-white text-[#121316] shadow-xs"
                    : "text-[#757985] hover:text-[#121316]"
                }`}
              >
                Monthly Trend
              </button>
            </div>
          </div>

          {/* Pulse Visualization */}
          {pulseView === "distribution" ? (
            <div className="py-4 space-y-4">
              {/* Stacked Proportional Bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#757985] mb-2 font-medium">
                  <span>Network Health Segments</span>
                  <span>{totalContacts} Total Contacts</span>
                </div>
                <div className="h-4 w-full rounded-full bg-[#E5E0D8] overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${(healthyCount / totalContacts) * 100}%` }}
                    className="h-full bg-[#4E6E55] transition-all duration-500 relative group"
                    title={`Healthy: ${healthyCount}`}
                  />
                  <div
                    style={{ width: `${(attentionCount / totalContacts) * 100}%` }}
                    className="h-full bg-[#D97736] transition-all duration-500 relative group"
                    title={`Needs Attention: ${attentionCount}`}
                  />
                  <div
                    style={{ width: `${(atRiskCount / totalContacts) * 100}%` }}
                    className="h-full bg-[#722F37] transition-all duration-500 relative group"
                    title={`At Risk: ${atRiskCount}`}
                  />
                  <div
                    style={{ width: `${(inactiveCount / totalContacts) * 100}%` }}
                    className="h-full bg-[#9C9FA8] transition-all duration-500 relative group"
                    title={`Inactive: ${inactiveCount}`}
                  />
                </div>
              </div>

              {/* 4 Health Tier Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#F3F7F4] border border-[#CFDFD2]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#29422F]">Healthy</span>
                    <span className="w-2 h-2 rounded-full bg-[#4E6E55]" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-[#121316] tabular-nums">
                    {healthyCount}
                  </div>
                  <div className="text-[11px] text-[#4E6E55] font-medium mt-0.5">
                    {Math.round((healthyCount / totalContacts) * 100)}% of network
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FFF9F5] border border-[#F8D2B9]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#873812]">Attention</span>
                    <span className="w-2 h-2 rounded-full bg-[#D97736]" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-[#121316] tabular-nums">
                    {attentionCount}
                  </div>
                  <div className="text-[11px] text-[#A24A1B] font-medium mt-0.5">
                    {Math.round((attentionCount / totalContacts) * 100)}% of network
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FDF7F8] border border-[#ECC7CC]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#722F37]">At Risk</span>
                    <span className="w-2 h-2 rounded-full bg-[#8B2635]" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-[#121316] tabular-nums">
                    {atRiskCount}
                  </div>
                  <div className="text-[11px] text-[#8B2635] font-medium mt-0.5">
                    Touchpoint overdue
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#DCD7CE]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#494C55]">Inactive</span>
                    <span className="w-2 h-2 rounded-full bg-[#9C9FA8]" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-[#121316] tabular-nums">
                    {inactiveCount}
                  </div>
                  <div className="text-[11px] text-[#757985] font-medium mt-0.5">
                    Dormant accounts
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Monthly Trend View */
            <div className="py-4">
              <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
                {[
                  { month: "Apr", score: 68, active: 18 },
                  { month: "May", score: 72, active: 22 },
                  { month: "Jun", score: 75, active: 28 },
                  { month: "Jul", score: 71, active: 25 },
                  { month: "Aug", score: 81, active: 34 },
                  { month: "Sep (Current)", score: 86, active: 38 }
                ].map((item, idx) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[11px] font-bold text-[#121316] group-hover:text-[#722F37]">
                      {item.score}%
                    </div>
                    <div className="w-full max-w-[42px] bg-[#EFEAE1] rounded-t-lg h-32 flex items-end p-1">
                      <div
                        style={{ height: `${item.score}%` }}
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          idx === 5
                            ? "bg-[#722F37]"
                            : "bg-[#5C7F99] group-hover:bg-[#4A6B82]"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-[#757985] truncate max-w-full">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-center text-xs text-[#757985]">
                {interactions.length
                  ? "Based on recorded interactions in this workspace."
                  : "No interaction trend data yet."}
              </div>
            </div>
          )}
        </div>

        {/* 9F. Quick Actions & Brand Card (1 col) */}
        <div className="surface-card rounded-2xl p-5 lg:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <h3 className="text-base font-bold text-[#121316]">
                Quick Actions
              </h3>
              <span className="text-xs text-[#757985]">Fast Triggers</span>
            </div>

            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => setQuickAddType("contact")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F5F2EB] hover:bg-[#EDE8DF] transition-colors border border-[#E5E0D8] group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#722F37] text-white flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#121316]">Add New Contact</div>
                    <div className="text-[11px] text-[#757985]">Store client or lead</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9C9FA8] group-hover:text-[#722F37] group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => setQuickAddType("interaction")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F5F2EB] hover:bg-[#EDE8DF] transition-colors border border-[#E5E0D8] group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#4A6B82] text-white flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#121316]">Log Interaction</div>
                    <div className="text-[11px] text-[#757985]">Sync call, note or meeting</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9C9FA8] group-hover:text-[#4A6B82] group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => setQuickAddType("task")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F5F2EB] hover:bg-[#EDE8DF] transition-colors border border-[#E5E0D8] group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D97736] text-white flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#121316]">Create Follow-up Task</div>
                    <div className="text-[11px] text-[#757985]">Keep promises on track</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9C9FA8] group-hover:text-[#D97736] group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => navigate("/import-export")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F5F2EB] hover:bg-[#EDE8DF] transition-colors border border-[#E5E0D8] group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#4E6E55] text-white flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#121316]">Import Contacts CSV</div>
                    <div className="text-[11px] text-[#757985]">Bulk spreadsheet mapping</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9C9FA8] group-hover:text-[#4E6E55] group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs text-[#757985]">
            <span>System State</span>
            <span className="inline-flex items-center gap-1.5 text-[#38533E] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#4E6E55] animate-pulse" />
              Live workspace data
            </span>
          </div>
        </div>
      </div>

      {/* 9C & 9D. Relationships Needing Attention & Priority Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-6">
        {/* 9C. Relationships Needing Attention (2 cols) */}
        <div className="lg:col-span-2 surface-card rounded-2xl p-5 lg:p-6 self-start">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#121316]">
                  Relationships Needing Attention
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3EB] text-[#A24A1B] border border-[#F8D2B9]">
                  Decay Alerts
                </span>
              </div>
              <p className="text-xs text-[#757985] mt-0.5">
                Key contacts where cadence has lapsed or follow-up is urgently due.
              </p>
            </div>

            <Link
              to="/relationships"
              className="text-xs font-semibold text-[#722F37] hover:text-[#5C1521] flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#F0ECE1] mt-2">
            {contactsNeedingAttention.map((c) => (
              <div
                key={c.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FBF9F5] rounded-xl px-2.5 transition-colors group cursor-pointer min-w-0"
                onClick={() => handleOpenContact(c.id)}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative">
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt={c.fullName}
                        className="w-11 h-11 rounded-full object-cover border border-[#DCD7CE]"
                      />
                    ) : (
                      <AvatarPlaceholder className="h-11 w-11 border border-[#DCD7CE]" />
                    )}
                    <span
                      className={`absolute -bottom-1 -right-1 block w-3.5 h-3.5 min-w-3.5 rounded-full aspect-square shrink-0 border-2 border-white ${
                        c.healthStatus === "At Risk" ? "bg-[#DC2626]" : "bg-[#D97736]"
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#121316] group-hover:text-[#722F37] transition-colors break-words">
                        {c.fullName}
                      </span>
                      <CategoryBadge category={c.category} />
                    </div>
                    <div className="text-xs text-[#757985] mt-0.5">
                      {c.jobTitle} • <span className="font-semibold text-[#494C55]">{c.company}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pl-14 sm:pl-0">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-[#121316]">
                      Next: {c.nextFollowUp}
                    </div>
                    <div className="text-[11px] text-[#9C9FA8]">
                      Last talk: {c.lastInteraction}
                    </div>
                  </div>

                  <HealthScoreGauge score={c.relationshipScore} size="sm" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast(`Follow-up call queued for ${c.fullName}`, "info");
                    }}
                    className="p-2 rounded-lg bg-[#EDE8DF] hover:bg-[#722F37] text-[#494C55] hover:text-white transition-colors"
                    title="Initiate follow-up"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9D. Priority Contacts (1 col) */}
        <div className="surface-card rounded-2xl p-5 lg:p-6 self-start">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#121316]">
                    Priority Contacts
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBF8F0] text-[#8C6D27] border border-[#EEDDB8]">
                    VIP Tier
                  </span>
                </div>
                <p className="text-xs text-[#757985] mt-0.5">
                  High-value executive relationships.
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-3">
              {priorityContacts.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC] hover:border-[#DDD4C4] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-[#DCD7CE]"
                        />
                      ) : (
                        <AvatarPlaceholder className="h-10 w-10 border border-[#DCD7CE]" />
                      )}
                      <div>
                        <div
                          onClick={() => handleOpenContact(c.id)}
                          className="text-xs font-bold text-[#121316] hover:text-[#722F37] cursor-pointer"
                        >
                          {c.fullName}
                        </div>
                        <div className="text-[11px] text-[#757985]">
                          {c.jobTitle} • {c.company}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#4E6E55] bg-[#E8F0EA] px-2 py-0.5 rounded-full border border-[#CFDFD2]">
                      {c.relationshipScore}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#EDE8DF] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#9C9FA8]">
                      Last: {c.lastInteraction}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => showToast(`Dialing ${c.phone}...`, "info")}
                        className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#494C55] hover:text-[#121316] transition-colors"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => showToast(`Opening email compose to ${c.email}...`, "info")}
                        className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#494C55] hover:text-[#121316] transition-colors"
                        title="Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenContact(c.id)}
                        className="px-2 py-1 rounded-md bg-[#722F37]/10 text-[#722F37] font-semibold text-[11px] hover:bg-[#722F37] hover:text-white transition-colors"
                      >
                        Dossier
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/contacts")}
            className="mt-4 w-full py-2 text-xs font-semibold text-[#494C55] hover:text-[#121316] bg-[#F5F2EB] hover:bg-[#EDE8DF] rounded-xl transition-colors border border-[#E5E0D8]"
          >
            Manage All VIPs
          </button>
        </div>
      </div>

      {/* 9E. Recent Activity Timeline & Upcoming Follow-ups Row */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Recent Activity Timeline */}
        <div className="surface-card rounded-2xl p-5 lg:p-6 self-start">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
            <div>
              <h3 className="text-base font-bold text-[#121316]">
                Recent Interaction Stream
              </h3>
              <p className="text-xs text-[#757985] mt-0.5">
                Audit trail of recent relationship touchpoints across the portfolio.
              </p>
            </div>
            <Link
              to="/interactions"
              className="text-xs font-semibold text-[#722F37] hover:text-[#5C1521] flex items-center gap-1"
            >
              View log
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative pl-6 mt-4 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E0D8]">
            {recentActivities.map((act) => {
              const getTypeStyle = (type) => {
                switch (type) {
                  case "Call":
                    return "bg-[#722F37] text-white";
                  case "Meeting":
                    return "bg-[#4A6B82] text-white";
                  case "Email":
                    return "bg-[#4E6E55] text-white";
                  case "Message":
                    return "bg-[#C5A059] text-white";
                  default:
                    return "bg-[#757985] text-white";
                }
              };

              return (
                <div key={act.id} className="relative group">
                  <div
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold ${getTypeStyle(
                      act.type
                    )}`}
                  />
                  <div className="p-3 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC] group-hover:border-[#DDD4C4] transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-bold text-[#121316]">
                        {act.title}
                      </div>
                      <span className="text-[10px] text-[#9C9FA8] shrink-0 font-medium">
                        {act.date}
                      </span>
                    </div>

                    <p className="text-xs text-[#757985] mt-1 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#EDE8DF] flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-medium text-[#494C55]">
                        <span className="font-semibold text-[#121316]">{act.contactName}</span>
                        <span>•</span>
                        <span>{act.contactCompany}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EDE8DF] text-[#494C55]">
                        {act.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scheduled Follow-up Tasks */}
        <div className="surface-card rounded-2xl p-5 lg:p-6 self-start">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
            <div>
              <h3 className="text-base font-bold text-[#121316]">
                Upcoming Follow-ups
              </h3>
              <p className="text-xs text-[#757985] mt-0.5">
                Tasks linked directly to client promises and agreements.
              </p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-[#722F37] hover:text-[#5C1521] flex items-center gap-1"
            >
              Task manager
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#F0ECE1] mt-2">
            {tasks.slice(0, 5).map((tsk) => {
              const isCompleted = tsk.status === "Completed";
              return (
                <div
                  key={tsk.id}
                  className="py-3 flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(tsk.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isCompleted
                          ? "bg-[#E8F0EA] border-[#7AA188] text-[#29422F]"
                          : "border-[#DCD7CE] hover:border-[#722F37] bg-white text-transparent"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <div
                        className={`text-xs font-bold leading-snug transition-colors ${
                          isCompleted
                            ? "text-[#365B45] decoration-0"
                            : "text-[#121316] group-hover:text-[#722F37]"
                        }`}
                      >
                        {tsk.title}
                      </div>
                      <div className="text-[11px] text-[#757985] mt-0.5 flex items-center gap-2">
                        <span>For: <strong className="text-[#494C55]">{tsk.contactName}</strong></span>
                        <span>•</span>
                        <span className={tsk.status === "Overdue" ? "text-[#DC2626] font-semibold" : ""}>
                          {tsk.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={tsk.priority} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
