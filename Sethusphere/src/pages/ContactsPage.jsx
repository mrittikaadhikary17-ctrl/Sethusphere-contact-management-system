import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Plus,
  Table as TableIcon,
  LayoutGrid,
  Star,
  MoreHorizontal,
  Mail,
  Phone,
  ArrowUpDown,
  Download,
  Upload,
  Archive,
  Trash2,
  ExternalLink,
  Eye,
  Check,
  Edit3
} from "lucide-react";
import { useContacts } from "../context/ContactContext";
import { StatusBadge, CategoryBadge } from "../components/common/StatusBadge";
import { HealthScoreGauge } from "../components/common/HealthScoreGauge";
import { EmptyState } from "../components/common/EmptyState";
import { AvatarPlaceholder } from "../components/common/AvatarPlaceholder";

export function ContactsPage() {
  const {
    contacts,
    setActiveContactId,
    setQuickAddType,
    toggleFavorite,
    archiveContact,
    deleteContact,
    getContactById,
    showToast,
    setEditingContact
  } = useContacts();

  const navigate = useNavigate();

  // View state
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedHealth, setSelectedHealth] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState("name"); // 'name' | 'score' | 'interaction'

  // Extract unique companies
  const companies = useMemo(() => {
    const set = new Set(contacts.map((c) => c.company).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [contacts]);

  // Filtered and sorted contacts
  const filteredContacts = useMemo(() => {
    return contacts
      .filter((c) => {
        // Archive toggle
        if (!showArchived && c.isArchived) return false;
        if (showArchived && !c.isArchived) return false;

        // Favorites filter
        if (onlyFavorites && !c.isFavorite) return false;

        // Category filter
        if (selectedCategory !== "All" && c.category !== selectedCategory) {
          return false;
        }

        // Health status filter
        if (selectedHealth !== "All" && c.healthStatus !== selectedHealth) {
          return false;
        }

        // Company filter
        if (selectedCompany !== "All" && c.company !== selectedCompany) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.fullName?.toLowerCase().includes(q);
          const matchCompany = c.company?.toLowerCase().includes(q);
          const matchEmail = c.email?.toLowerCase().includes(q);
          const matchJob = c.jobTitle?.toLowerCase().includes(q);
          const matchTags = c.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchCompany && !matchEmail && !matchJob && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "score") {
          return b.relationshipScore - a.relationshipScore;
        }
        if (sortBy === "interaction") {
          return (b.totalInteractions || 0) - (a.totalInteractions || 0);
        }
        return a.fullName.localeCompare(b.fullName);
      });
  }, [
    contacts,
    showArchived,
    onlyFavorites,
    selectedCategory,
    selectedHealth,
    selectedCompany,
    searchQuery,
    sortBy
  ]);

  const handleOpenProfile = async (contactId) => {
    setActiveContactId(contactId);
    try {
      await getContactById(contactId);
      navigate("/contact-profile");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* 10. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-[#121316]">
              Contacts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE8DF] text-[#494C55]">
              {filteredContacts.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#757985] mt-0.5">
            Manage your professional network in one intelligent workspace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("/import-export")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DCD7CE] text-xs font-semibold text-[#494C55] hover:text-[#121316] hover:bg-[#F5F2EB] transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-[#757985]" />
            <span>Import</span>
          </button>

          <button
            onClick={() => navigate("/import-export")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DCD7CE] text-xs font-semibold text-[#494C55] hover:text-[#121316] hover:bg-[#F5F2EB] transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#757985]" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setQuickAddType("contact")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#722F37] hover:bg-[#5C1521] text-xs font-semibold text-white shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="surface-card rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#722F37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, company, email, or tag..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F5F2EB] border border-[#E5E0D8] text-xs text-[#121316] placeholder-[#9C9FA8] focus:outline-none focus:border-[#722F37] focus:bg-white transition-all"
            />
          </div>

          {/* View Toggle & Favorites Filter */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Starred filter button */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                onlyFavorites
                  ? "bg-[#FBF8F0] border-[#EEDDB8] text-[#8C6D27]"
                  : "bg-white border-[#E5E0D8] text-[#757985] hover:text-[#121316]"
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  onlyFavorites ? "fill-[#C5A059] text-[#C5A059]" : ""
                }`}
              />
              <span>Favorites</span>
            </button>

            {/* Archive toggle */}
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showArchived
                  ? "bg-[#EDE8DF] border-[#DCD7CE] text-[#121316]"
                  : "bg-white border-[#E5E0D8] text-[#757985] hover:text-[#121316]"
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{showArchived ? "Viewing Archived" : "Archived"}</span>
            </button>

            {/* Table / Grid Mode Toggle */}
            <div className="flex items-center p-1 bg-[#F5F2EB] border border-[#E5E0D8] rounded-xl">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "table"
                    ? "bg-white text-[#121316] shadow-xs"
                    : "text-[#757985] hover:text-[#121316]"
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-[#121316] shadow-xs"
                    : "text-[#757985] hover:text-[#121316]"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="pt-2 border-t border-[#F0ECE1] flex flex-wrap items-center gap-2.5 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#757985] font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F5F2EB] border border-[#E5E0D8] text-[#121316] font-medium focus:outline-none focus:border-[#722F37]"
            >
              <option value="All">All Categories</option>
              <option value="Client">Client</option>
              <option value="Lead">Lead</option>
              <option value="Partner">Partner</option>
              <option value="VIP">VIP</option>
              <option value="Vendor">Vendor</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          {/* Health Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#757985] font-medium">Health:</span>
            <select
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F5F2EB] border border-[#E5E0D8] text-[#121316] font-medium focus:outline-none focus:border-[#722F37]"
            >
              <option value="All">All Health Tiers</option>
              <option value="Healthy">Healthy (85+)</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="At Risk">At Risk</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Company Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#757985] font-medium">Company:</span>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F5F2EB] border border-[#E5E0D8] text-[#121316] font-medium focus:outline-none focus:border-[#722F37] max-w-[160px]"
            >
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[#757985] font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F5F2EB] border border-[#E5E0D8] text-[#121316] font-medium focus:outline-none focus:border-[#722F37]"
            >
              <option value="name">Name (A-Z)</option>
              <option value="score">Relationship Score</option>
              <option value="interaction">Most Touchpoints</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: TABLE VIEW vs GRID VIEW */}
      {filteredContacts.length === 0 ? (
        <EmptyState
          title="No matching contacts found"
          description="Try adjusting your filter settings or search terms to see contacts in your portfolio."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("All");
            setSelectedHealth("All");
            setSelectedCompany("All");
            setOnlyFavorites(false);
            setShowArchived(false);
          }}
        />
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="surface-card rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1E2024]">
              <thead className="bg-[#F5F2EB] border-b border-[#E5E0D8] text-[#757985] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Company & Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Relationship</th>
                  <th className="py-3 px-4">Health</th>
                  <th className="py-3 px-4">Last Interaction</th>
                  <th className="py-3 px-4">Next Follow-up</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {filteredContacts.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenProfile(c.id)}
                    className="hover:bg-[#FBF9F5] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(c.id);
                          }}
                          className="shrink-0 text-[#CACCD2] hover:text-[#C5A059] transition-colors"
                          aria-label={c.isFavorite ? "Remove favorite" : "Add favorite"}
                        >
                          <Star className={`w-4 h-4 ${c.isFavorite ? "fill-[#C5A059] text-[#C5A059]" : ""}`} />
                        </button>
                        {c.avatar ? (
                          <img src={c.avatar} alt={c.fullName} className="w-10 h-10 rounded-full object-cover border border-[#DCD7CE]" />
                        ) : (
                          <AvatarPlaceholder className="h-10 w-10 border border-[#DCD7CE]" />
                        )}
                        <div>
                          <div className="font-bold text-[#121316] group-hover:text-[#722F37] transition-colors text-sm">
                            {c.fullName}
                          </div>
                          <div className="text-[11px] text-[#757985]">
                            {c.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Company & Job */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#121316]">
                        {c.company}
                      </div>
                      <div className="text-[11px] text-[#757985]">
                        {c.jobTitle}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <CategoryBadge category={c.category} />
                    </td>

                    {/* Relationship */}
                    <td className="py-3.5 px-4">
                      <HealthScoreGauge score={c.relationshipScore} size="sm" showLabel />
                    </td>

                    {/* Health */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.healthStatus} size="sm" />
                    </td>

                    {/* Last Interaction */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#121316]">
                        {c.lastInteraction}
                      </div>
                      <div className="text-[10px] text-[#9C9FA8]">
                        {c.lastInteractionType || "Call"} • {c.totalInteractions || 0} total
                      </div>
                    </td>

                    {/* Next Follow-up */}
                    <td className="py-3.5 px-4">
                      <div
                        className={`font-semibold ${
                          c.nextFollowUp?.toLowerCase().includes("overdue")
                            ? "text-[#DC2626]"
                            : c.nextFollowUp?.toLowerCase().includes("today")
                            ? "text-[#D97736]"
                            : "text-[#121316]"
                        }`}
                      >
                        {c.nextFollowUp}
                      </div>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => showToast(`Dialing ${c.phone}...`, "info")}
                          className="p-1.5 rounded-lg text-[#757985] hover:text-[#121316] hover:bg-[#EDE8DF] transition-colors"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => showToast(`Composing to ${c.email}...`, "info")}
                          className="p-1.5 rounded-lg text-[#757985] hover:text-[#121316] hover:bg-[#EDE8DF] transition-colors"
                          title="Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenProfile(c.id)}
                          className="p-1.5 rounded-lg text-[#722F37] hover:bg-[#722F37]/10 transition-colors"
                          title="Open Relationship Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingContact(c);
                            setQuickAddType("contact-edit");
                          }}
                          className="p-1.5 rounded-lg text-[#757985] hover:text-[#121316] hover:bg-[#EDE8DF] transition-colors"
                          title="Edit Contact"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await archiveContact(c.id);
                            } catch (error) {
                              showToast(error.message, "error");
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#757985] hover:text-[#121316] hover:bg-[#EDE8DF] transition-colors"
                          title={showArchived ? "Restore Contact" : "Archive Contact"}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (!window.confirm(`Delete ${c.fullName}?`)) return;
                            try {
                              await deleteContact(c.id);
                            } catch (error) {
                              showToast(error.message, "error");
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#757985] hover:text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                          title="Delete Contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContacts.map((c) => (
            <div
              key={c.id}
              onClick={() => handleOpenProfile(c.id)}
              className="surface-card rounded-2xl p-5 surface-card-hover cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="relative">
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.fullName} className="w-13 h-13 rounded-full object-cover border border-[#DCD7CE]" />
                    ) : (
                      <AvatarPlaceholder className="h-13 w-13 border border-[#DCD7CE]" />
                    )}
                    <span
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        c.healthStatus === "Healthy"
                          ? "bg-[#4E6E55]"
                          : c.healthStatus === "Needs Attention"
                          ? "bg-[#D97736]"
                          : c.healthStatus === "At Risk"
                          ? "bg-[#DC2626]"
                          : "bg-[#9C9FA8]"
                      }`}
                    />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(c.id);
                    }}
                    className="p-1 text-[#CACCD2] hover:text-[#C5A059] transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        c.isFavorite ? "fill-[#C5A059] text-[#C5A059]" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await archiveContact(c.id);
                      } catch (error) {
                        showToast(error.message, "error");
                      }
                    }}
                    className="p-1 text-[#757985] hover:text-[#121316] transition-colors"
                    title={showArchived ? "Restore Contact" : "Archive Contact"}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#121316] group-hover:text-[#722F37] transition-colors">
                      {c.fullName}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#494C55] mt-0.5">
                    {c.company}
                  </div>
                  <div className="text-[11px] text-[#757985]">
                    {c.jobTitle}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <CategoryBadge category={c.category} />
                  <HealthScoreGauge score={c.relationshipScore} size="sm" showLabel={false} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-[11px]">
                <span className="text-[#9C9FA8]">
                  Talk: {c.lastInteraction}
                </span>

                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => showToast(`Calling ${c.fullName}...`, "info")}
                    className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#494C55]"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => showToast(`Composing email to ${c.email}...`, "info")}
                    className="p-1.5 rounded-md hover:bg-[#EDE8DF] text-[#494C55]"
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
