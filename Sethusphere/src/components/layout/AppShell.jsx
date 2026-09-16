import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { GlobalSearchModal } from "../common/GlobalSearchModal";
import { QuickAddModal } from "../common/QuickAddModal";
import { Toast } from "../common/Toast";

export function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FBF9F5] text-[#1E2024]">
      {/* Desktop Sidebar (hidden on screens < 1024px) */}
      <div className="hidden lg:block w-64 shrink-0 h-full">
        <Sidebar onCloseMobile={() => {}} />
      </div>

      {/* Mobile Off-canvas Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#121316]/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-[#121316] z-10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} showCloseButton />
          </div>
        </div>
      )}

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-6 lg:pb-10">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <QuickAddModal />
      <Toast />
    </div>
  );
}
