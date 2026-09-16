import React from "react";
import { useNavigate } from "react-router-dom";
import { FolderKanban, Users, Tag, ArrowRight, Sparkles, Plus } from "lucide-react";
import { useContacts } from "../context/ContactContext";

export function GroupsPage() {
  const { groups, tags, contacts, setActiveContactId } = useContacts();
  const navigate = useNavigate();

  const handleOpenGroup = (categoryName) => {
    navigate("/contacts");
  };

  return (
    <div className="space-y-6">
      {/* 16. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-[#121316]">
              Groups & Tags
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE8DF] text-[#494C55]">
              {groups.length} Segments
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#757985] mt-0.5">
            Organize relationships by ecosystem segments, contract categories, and thematic tags.
          </p>
        </div>
      </div>

      {/* 16. GROUPS DIRECTORY */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#757985]">
            Relationship Segments
          </h2>
          <span className="text-xs text-[#9C9FA8]">Categorical groupings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.length ? groups.map((grp) => {
            // Count actual contacts matching this group
            const actualCount = contacts.filter(
              (c) => c.category?.toLowerCase() === grp.name.toLowerCase()
            ).length;

            return (
              <div
                key={grp.id}
                onClick={() => handleOpenGroup(grp.name)}
                className="surface-card rounded-2xl p-5 surface-card-hover cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: grp.color }}
                      />
                      <h3 className="text-base font-bold text-[#121316] group-hover:text-[#722F37] transition-colors">
                        {grp.name}
                      </h3>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5F2EB] text-[#121316] border border-[#E5E0D8]">
                      {actualCount} contacts
                    </span>
                  </div>

                  <p className="text-xs text-[#757985] mt-3 leading-relaxed">
                    {grp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {grp.tags?.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#FBF9F5] text-[#494C55] border border-[#EBE6DC]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs font-semibold text-[#722F37]">
                  <span>View contacts in {grp.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          }) : (
            <div className="surface-card rounded-2xl p-6 text-sm text-[#757985]">
              No groups available yet.
            </div>
          )}
        </div>
      </div>

      {/* 16. TAG CLOUD */}
      <div className="surface-card rounded-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
          <div>
            <h2 className="text-base font-bold text-[#121316]">
              Portfolio Tags Directory
            </h2>
            <p className="text-xs text-[#757985] mt-0.5">
              Cross-cutting tags applied across client and partner profiles.
            </p>
          </div>

          <span className="text-xs text-[#9C9FA8] font-medium">
            {tags.length} Active Tags
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 mt-5">
          {tags.length ? tags.map((t) => {
            const getColorStyle = (col) => {
              switch (col) {
                case "wine":
                  return "bg-[#F7E4E7] text-[#722F37] border-[#ECC7CC] hover:bg-[#722F37] hover:text-white";
                case "gold":
                  return "bg-[#FBF8F0] text-[#8C6D27] border-[#EEDDB8] hover:bg-[#C5A059] hover:text-white";
                case "blue":
                  return "bg-[#EBF1F5] text-[#2B4B64] border-[#BFD3E0] hover:bg-[#4A6B82] hover:text-white";
                case "sage":
                  return "bg-[#E8F0EA] text-[#29422F] border-[#CFDFD2] hover:bg-[#4E6E55] hover:text-white";
                case "amber":
                  return "bg-[#FEF3EB] text-[#A24A1B] border-[#F8D2B9] hover:bg-[#D97736] hover:text-white";
                default:
                  return "bg-[#F0EEEA] text-[#313339] border-[#DCD7CE] hover:bg-[#121316] hover:text-white";
              }
            };

            return (
              <button
                key={t.name}
                onClick={() => navigate("/contacts")}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${getColorStyle(
                  t.color
                )}`}
              >
                <Tag className="w-3 h-3" />
                <span>{t.name}</span>
                <span className="opacity-75 tabular-nums">({t.count})</span>
              </button>
            );
          }) : (
            <p className="text-sm text-[#757985]">No tags available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
