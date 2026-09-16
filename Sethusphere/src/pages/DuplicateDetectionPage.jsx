import React, { useState } from "react";
import {
  CopyCheck,
  GitMerge,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  UserCheck,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Building
} from "lucide-react";
import { useContacts } from "../context/ContactContext";
import { EmptyState } from "../components/common/EmptyState";
import { StatusBadge, CategoryBadge } from "../components/common/StatusBadge";

export function DuplicateDetectionPage() {
  const { duplicates, mergeDuplicate, ignoreDuplicate } = useContacts();
  const [activePairIndex, setActivePairIndex] = useState(0);

  const visiblePairIndex = Math.min(activePairIndex, Math.max(duplicates.length - 1, 0));
  const activePair = duplicates[visiblePairIndex] || duplicates[0];

  return (
    <div className="space-y-6">
      {/* 17. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-[#121316]">
              Duplicate Detection & Hygiene
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5A059]/15 text-[#9B7830] border border-[#C5A059]/30">
              {duplicates.length} Potential Collisions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#757985] mt-0.5">
            Preserve network integrity. Compare overlapping contact profiles side-by-side and resolve conflicts.
          </p>
        </div>
      </div>

      {duplicates.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Zero Duplicate Conflicts Found"
          description="Your relationship repository is 100% deduplicated and compliant with hygiene rules."
        />
      ) : (
        <div className="space-y-6">
          {/* Pair Selector Tabs */}
          {duplicates.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {duplicates.map((pair, idx) => (
                <button
                  key={pair.id}
                  onClick={() => setActivePairIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                    idx === visiblePairIndex
                      ? "bg-[#121316] text-white"
                      : "bg-white text-[#757985] border border-[#E5E0D8] hover:text-[#121316]"
                  }`}
                >
                  Pair #{idx + 1}: {pair.primaryContact.fullName}
                </button>
              ))}
            </div>
          )}

          {/* Conflict Reason Banner */}
          <div className="p-4 rounded-2xl bg-[#FBF8F0] border border-[#EEDDB8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 text-[#8C6D27] flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#121316]">
                  Collision Flag: {activePair.reason}
                </div>
                <div className="text-[11px] text-[#757985]">
                  Fuzzy algorithm match confidence: <strong>{activePair.matchConfidence}%</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => ignoreDuplicate(activePair.id)}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#DCD7CE] text-xs font-semibold text-[#757985] hover:text-[#121316] transition-colors"
              >
                Ignore
              </button>
              <button
                onClick={() => mergeDuplicate(activePair.id, activePair.primaryContact.id)}
                className="px-4 py-1.5 rounded-lg bg-[#722F37] hover:bg-[#5C1521] text-xs font-semibold text-white transition-all shadow-sm flex items-center gap-1.5"
              >
                <GitMerge className="w-3.5 h-3.5" />
                <span>Merge Profiles</span>
              </button>
            </div>
          </div>

          {/* 17. SIDE-BY-SIDE PROFILE COMPARISON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Profile (Record A) */}
            <div className="surface-card rounded-2xl p-6 border-2 border-[#4E6E55]/30 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F0EA] text-[#29422F] border border-[#CFDFD2]">
                      Primary Record A
                    </span>
                    <span className="text-xs font-semibold text-[#4E6E55]">Recommended Base</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={activePair.primaryContact.avatar}
                    alt={activePair.primaryContact.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#DCD7CE]"
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#121316]">
                      {activePair.primaryContact.fullName}
                    </h3>
                    <div className="text-xs text-[#757985] mt-0.5">
                      {activePair.primaryContact.jobTitle} • <strong>{activePair.primaryContact.company}</strong>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <CategoryBadge category={activePair.primaryContact.category} />
                      <StatusBadge status={activePair.primaryContact.healthStatus} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Attributes Comparison */}
                <div className="mt-5 divide-y divide-[#F0ECE1] text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#757985]">Work Email</span>
                    <span className="font-semibold text-[#121316]">
                      {activePair.primaryContact.email}
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#757985]">Phone Number</span>
                    <span className="font-semibold text-[#121316] bg-[#FEF3EB] px-1.5 py-0.5 rounded">
                      {activePair.primaryContact.phone}
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#757985]">Address</span>
                    <span className="font-semibold text-[#121316] text-right max-w-[200px]">
                      {activePair.primaryContact.address}
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#757985]">Touchpoints</span>
                    <span className="font-semibold text-[#121316]">
                      {activePair.primaryContact.totalInteractions} events
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#757985]">Health Score</span>
                    <span className="font-bold text-[#4E6E55]">
                      {activePair.primaryContact.relationshipScore} / 100
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => mergeDuplicate(activePair.id, activePair.primaryContact.id)}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#4E6E55] hover:bg-[#38533E] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Keep Record A & Merge Attributes
              </button>
            </div>

            {/* Candidate Duplicate Profile (Record B) */}
            <div className="surface-card rounded-2xl p-6 border border-[#EBE6DC] relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3EB] text-[#A24A1B] border border-[#F8D2B9]">
                      Conflicting Record B
                    </span>
                    <span className="text-xs text-[#757985]">Candidate for consolidation</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={activePair.duplicateContact.avatar}
                    alt={activePair.duplicateContact.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#DCD7CE]"
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#121316]">
                      {activePair.duplicateContact.fullName}
                    </h3>
                    <div className="text-xs text-[#757985] mt-0.5">
                      {activePair.duplicateContact.jobTitle} • <strong>{activePair.duplicateContact.company}</strong>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <CategoryBadge category={activePair.duplicateContact.category} />
                      <StatusBadge status={activePair.duplicateContact.healthStatus} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Attributes Comparison */}
                <div className="mt-5 divide-y divide-[#F0ECE1] text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#757985]">Email</span>
                    <span className="font-semibold text-[#121316]">
                      {activePair.duplicateContact.email}
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#757985]">Phone Number</span>
                    <span className="font-semibold text-[#121316] bg-[#FEF3EB] px-1.5 py-0.5 rounded">
                      {activePair.duplicateContact.phone}
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#757985]">Address</span>
                    <span className="font-semibold text-[#121316] text-right max-w-[200px]">
                      {activePair.duplicateContact.address}
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#757985]">Touchpoints</span>
                    <span className="font-semibold text-[#121316]">
                      {activePair.duplicateContact.totalInteractions} events
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#757985]">Health Score</span>
                    <span className="font-bold text-[#873812]">
                      {activePair.duplicateContact.relationshipScore} / 100
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={() => ignoreDuplicate(activePair.id)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F5F2EB] hover:bg-[#EDE8DF] text-[#121316] text-xs font-semibold transition-colors"
                >
                  Keep Both
                </button>
                <button
                  onClick={() => mergeDuplicate(activePair.id, activePair.primaryContact.id)}
                  className="flex-1 py-2.5 rounded-xl bg-[#722F37] hover:bg-[#5C1521] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <GitMerge className="w-3.5 h-3.5" />
                  Merge In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
