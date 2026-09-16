import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  BarChart3,
  User,
  Plus,
  UserPlus,
  PhoneCall,
  X
} from "lucide-react";
import { useContacts } from "../../context/ContactContext";

export function MobileNavigation() {
  const { setQuickAddType } = useContacts();
  const [isFabOpen, setIsFabOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button (FAB) Speed Dial */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        {isFabOpen && (
          <div className="flex flex-col items-end gap-2.5 mb-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <button
              onClick={() => {
                setIsFabOpen(false);
                setQuickAddType("contact");
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFFFFF] shadow-lg border border-[#DCD7CE] text-xs font-semibold text-[#121316] active:scale-95"
            >
              <span>Add Contact</span>
              <div className="w-7 h-7 rounded-full bg-[#722F37]/10 text-[#722F37] flex items-center justify-center">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => {
                setIsFabOpen(false);
                setQuickAddType("interaction");
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFFFFF] shadow-lg border border-[#DCD7CE] text-xs font-semibold text-[#121316] active:scale-95"
            >
              <span>Log Interaction</span>
              <div className="w-7 h-7 rounded-full bg-[#4A6B82]/10 text-[#4A6B82] flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => {
                setIsFabOpen(false);
                setQuickAddType("task");
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFFFFF] shadow-lg border border-[#DCD7CE] text-xs font-semibold text-[#121316] active:scale-95"
            >
              <span>Create Task</span>
              <div className="w-7 h-7 rounded-full bg-[#D97736]/10 text-[#D97736] flex items-center justify-center">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="w-13 h-13 rounded-full bg-[#722F37] text-white shadow-xl flex items-center justify-center active:scale-90 transition-transform focus:outline-none"
          aria-label="Floating Action"
        >
          {isFabOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#121316] border-t border-[#262932] px-2 flex items-center justify-around z-30 shadow-2xl">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-[#EDE8DF] font-bold" : "text-[#757985] hover:text-[#CACCD2]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1 rounded-lg ${
                  isActive ? "text-[#EDE8DF] bg-[#722F37]" : ""
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <span className="mt-0.5">Home</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/contacts"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-[#EDE8DF] font-bold" : "text-[#757985] hover:text-[#CACCD2]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1 rounded-lg ${
                  isActive ? "text-[#EDE8DF] bg-[#722F37]" : ""
                }`}
              >
                <Users className="w-4 h-4" />
              </div>
              <span className="mt-0.5">Contacts</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-[#EDE8DF] font-bold" : "text-[#757985] hover:text-[#CACCD2]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1 rounded-lg ${
                  isActive ? "text-[#EDE8DF] bg-[#722F37]" : ""
                }`}
              >
                <CheckSquare className="w-4 h-4" />
              </div>
              <span className="mt-0.5">Tasks</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-[#EDE8DF] font-bold" : "text-[#757985] hover:text-[#CACCD2]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1 rounded-lg ${
                  isActive ? "text-[#EDE8DF] bg-[#722F37]" : ""
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="mt-0.5">Insights</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-[#EDE8DF] font-bold" : "text-[#757985] hover:text-[#CACCD2]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1 rounded-lg ${
                  isActive ? "text-[#EDE8DF] bg-[#722F37]" : ""
                }`}
              >
                <User className="w-4 h-4" />
              </div>
              <span className="mt-0.5">Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </>
  );
}
