import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Palette,
  Users2,
  Database,
  Lock,
  Check,
  Sparkles,
  Save,
  CheckCircle2
} from "lucide-react";
import { useContacts } from "../context/ContactContext";
import { PhoneInputField } from "../components/common/PhoneInputField";
import { UserAvatar } from "../components/common/UserAvatar";

export function SettingsPage() {
  const { showToast, profile, updateProfile } = useContacts();

  const [activeSection, setActiveSection] = useState("profile"); // 'profile' | 'team' | 'appearance' | 'notifications' | 'data' | 'security'
  const [profileForm, setProfileForm] = useState(profile);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    showToast("Profile credentials updated successfully");
  };

  return (
    <div className="space-y-6">
      {/* 20. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8]">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-[#121316]">
            Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#757985] mt-0.5">
            Configure relationship health parameters, team access roles, and portfolio cadences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="surface-card rounded-2xl p-2.5 space-y-1 h-fit">
          {[
            { id: "profile", label: "Profile & Identity", icon: User },
            { id: "team", label: "Team & Role Matrix", icon: Users2 },
            { id: "appearance", label: "Theme & Palette", icon: Palette },
            { id: "notifications", label: "Cadence Notifications", icon: Bell },
            { id: "data", label: "Data Management", icon: Database },
            { id: "security", label: "Security & Access", icon: Shield }
          ].map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeSection === sec.id
                    ? "bg-[#722F37] text-white shadow-xs"
                    : "text-[#757985] hover:bg-[#F5F2EB] hover:text-[#121316]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Content Area (3 cols) */}
        <div className="lg:col-span-3">
          {/* SECTION 1: PROFILE */}
          {activeSection === "profile" && (
            <div className="surface-card rounded-2xl p-6 lg:p-7 space-y-6">
              <div className="pb-4 border-b border-[#F0ECE1]">
                <h3 className="text-base font-bold text-[#121316]">
                  User Profile & Relationship Ownership
                </h3>
                <p className="text-xs text-[#757985] mt-0.5">
                  Your identity as associated with notes, interaction logs, and follow-ups.
                </p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="flex items-center gap-4 pb-4">
                  <UserAvatar user={profileForm} className="h-16 w-16 rounded-2xl border-2 border-white shadow-md" />
                  <div>
                    <button
                      type="button"
                      onClick={() => document.getElementById("profile-avatar-input")?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#F5F2EB] hover:bg-[#EDE8DF] text-xs font-semibold text-[#121316] border border-[#DCD7CE]"
                    >
                      Change Avatar
                    </button>
                    <input id="profile-avatar-input" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                        showToast("Please choose a JPG, JPEG, PNG, or WEBP image.", "error");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => setProfileForm((current) => ({ ...current, avatar: reader.result }));
                      reader.readAsDataURL(file);
                    }} />
                    <span className="text-[11px] text-[#9C9FA8] block mt-1">
                      JPG, GIF or PNG. Max size 2MB.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                      Designation / Role Title
                    </label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                      Timezone
                    </label>
                    <input
                      type="text"
                      value={profileForm.timezone}
                      onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                    />
                  </div>
                </div>
                <PhoneInputField
                  label="Phone number"
                  value={profileForm.phone}
                  onChange={(phone) => setProfileForm({ ...profileForm, phone })}
                />

                <div className="pt-4 border-t border-[#F0ECE1] flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#722F37] hover:bg-[#5C1521] rounded-xl transition-all shadow-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 2: TEAM & ROLES (Prompt Requirement 20) */}
          {activeSection === "team" && (
            <div className="surface-card rounded-2xl p-6 lg:p-7 space-y-6">
              <div className="pb-4 border-b border-[#F0ECE1]">
                <h3 className="text-base font-bold text-[#121316]">
                  Role-Based Access Control (RBAC)
                </h3>
                <p className="text-xs text-[#757985] mt-0.5">
                  Visual permission matrix for Admin, Manager, and Employee tiers.
                </p>
              </div>

              {/* Roles Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#1E2024]">
                  <thead className="bg-[#F5F2EB] text-[#757985] font-semibold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Permission Capability</th>
                      <th className="py-3 px-4 text-center">Admin</th>
                      <th className="py-3 px-4 text-center">Manager</th>
                      <th className="py-3 px-4 text-center">Employee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE1]">
                    {[
                      { cap: "Create, Edit & View Contacts", admin: true, mgr: true, emp: true },
                      { cap: "Log Interactions & Schedule Tasks", admin: true, mgr: true, emp: true },
                      { cap: "View VIP Relationship Health Scores", admin: true, mgr: true, emp: true },
                      { cap: "Export CSV Dossier & Network Audits", admin: true, mgr: true, emp: false },
                      { cap: "Resolve & Merge Duplicate Collisions", admin: true, mgr: true, emp: false },
                      { cap: "Delete Client / Account Records", admin: true, mgr: false, emp: false },
                      { cap: "Manage Team Permissions & Workspace Settings", admin: true, mgr: false, emp: false }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#FBF9F5]">
                        <td className="py-3 px-4 font-medium text-[#121316]">{row.cap}</td>
                        <td className="py-3 px-4 text-center">
                          {row.admin ? (
                            <Check className="w-4 h-4 text-[#4E6E55] mx-auto" />
                          ) : (
                            <span className="text-[#CACCD2]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {row.mgr ? (
                            <Check className="w-4 h-4 text-[#4E6E55] mx-auto" />
                          ) : (
                            <span className="text-[#CACCD2]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {row.emp ? (
                            <Check className="w-4 h-4 text-[#4E6E55] mx-auto" />
                          ) : (
                            <span className="text-[#CACCD2]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: APPEARANCE */}
          {activeSection === "appearance" && (
            <div className="surface-card rounded-2xl p-6 lg:p-7 space-y-6">
              <div className="pb-4 border-b border-[#F0ECE1]">
                <h3 className="text-base font-bold text-[#121316]">
                  Design System & Aesthetic Tokens
                </h3>
                <p className="text-xs text-[#757985] mt-0.5">
                  Sethusphere bespoke palette tokens (Deep Charcoal, Warm Ivory, Burgundy Wine).
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-semibold text-[#121316] block mb-2">
                    Primary Accent Token
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#722F37] text-white font-bold flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-white" />
                      Deep Burgundy / Wine (#722F37)
                    </div>
                    <div className="p-3 rounded-xl bg-[#121316] text-white font-bold flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#C5A059]" />
                      Deep Charcoal (#121316)
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0ECE1]">
                  <span className="font-semibold text-[#121316] block mb-1">
                    Workspace Canvas
                  </span>
                  <p className="text-[#757985] text-xs">
                    Warm Ivory / Soft Cream background (#FBF9F5) engineered to reduce ocular fatigue compared to harsh stark white.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <div className="surface-card rounded-2xl p-6 lg:p-7 space-y-5">
              <div className="pb-4 border-b border-[#F0ECE1]">
                <h3 className="text-base font-bold text-[#121316]">
                  Follow-up Cadence Reminders
                </h3>
                <p className="text-xs text-[#757985] mt-0.5">
                  Configure automated threshold alerts before relationships drop into decay.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { title: "VIP Account Inactivity Nudge", desc: "Alert after 14 days without interaction", active: true },
                  { title: "Daily Morning Follow-up Digest", desc: "Sent at 8:30 AM IST with tasks due today", active: true },
                  { title: "Relationship Score Drop Warning", desc: "Trigger alert if score drops by more than 10 points", active: true },
                  { title: "Duplicate Collision Auto-scan", desc: "Weekly fuzzy match report across phone and email domains", active: false }
                ].map((n, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#121316]">{n.title}</div>
                      <div className="text-[11px] text-[#757985] mt-0.5">{n.desc}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${n.active ? "bg-[#E8F0EA] text-[#29422F]" : "bg-[#EDE8DF] text-[#757985]"}`}>
                      {n.active ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: DATA MANAGEMENT */}
          {activeSection === "data" && (
            <div className="surface-card rounded-2xl p-6 lg:p-7 space-y-6">
              <div className="pb-4 border-b border-[#F0ECE1]">
                <h3 className="text-base font-bold text-[#121316]">
                  Workspace Data
                </h3>
                <p className="text-xs text-[#757985] mt-0.5">
                  Manage the records connected to your workspace.
                </p>
              </div>

              <p className="text-sm text-[#757985]">
                Contacts, activities, tasks, groups, and tags are loaded from the current workspace.
              </p>
            </div>
          )}

          {/* SECTION 6: SECURITY */}
          {activeSection === "security" && (
            <div className="surface-card rounded-2xl p-6 lg:p-7 space-y-6">
              <div className="pb-4 border-b border-[#F0ECE1]">
                <h3 className="text-base font-bold text-[#121316]">
                  Security, Sessions & Enterprise Compliance
                </h3>
                <p className="text-xs text-[#757985] mt-0.5">
                  Visual security controls (Frontend Phase Demonstration).
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#121316]">Hardware Security Key / MFA</div>
                    <div className="text-[11px] text-[#757985]">FIDO2 / WebAuthn token verified</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F0EA] text-[#29422F]">
                    Enforced
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#121316]">Active Session</div>
                    <div className="text-[11px] text-[#757985]">Chrome 128 on Windows 11 • Gurugram, India (Current)</div>
                  </div>
                  <span className="text-xs font-semibold text-[#4E6E55]">Active Now</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
