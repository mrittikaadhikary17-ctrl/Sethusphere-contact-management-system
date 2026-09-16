import React, { useState } from "react";
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Calendar,
  Filter,
  User,
  Trash2,
  Check
} from "lucide-react";
import { useContacts } from "../context/ContactContext";
import { StatusBadge } from "../components/common/StatusBadge";
import { useNavigate } from "react-router-dom";

export function TasksPage() {
  const { tasks, toggleTaskStatus, deleteTask, setQuickAddType, setActiveContactId } = useContacts();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState("All"); // 'All' | 'Pending' | 'In Progress' | 'Completed' | 'Overdue'
  const [filterPriority, setFilterPriority] = useState("All"); // 'All' | 'High' | 'Medium' | 'Low'
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'board'

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus !== "All" && t.status !== filterStatus) return false;
    if (filterPriority !== "All" && t.priority !== filterPriority) return false;
    return true;
  });

  const overdueTasks = tasks.filter((t) => t.status === "Overdue");
  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress");
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  const handleOpenContact = (contactId) => {
    if (contactId) {
      setActiveContactId(contactId);
      navigate("/contact-profile");
    }
  };

  return (
    <div className="space-y-6">
      {/* 15. Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-[#121316]">
              Tasks & Follow-ups
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D97736]/10 text-[#D97736] border border-[#D97736]/20">
              {pendingTasks.length + overdueTasks.length} Action Items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#757985] mt-0.5">
            Never drop a critical conversation thread. Maintain accountability across client commitments.
          </p>
        </div>

        <div className="flex w-full flex-col sm:flex-row sm:items-center lg:w-auto gap-2.5">
          {/* Mode Switcher */}
          <div className="flex w-full sm:w-auto items-center p-1 bg-white border border-[#DCD7CE] rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-[#121316] text-white" : "text-[#757985]"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === "board" ? "bg-[#121316] text-white" : "text-[#757985]"
              }`}
            >
              Status Board
            </button>
          </div>

          <button
            onClick={() => setQuickAddType("task")}
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 rounded-xl bg-[#722F37] hover:bg-[#5C1521] text-xs font-semibold text-white shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="surface-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="text-[#757985] font-semibold">Status:</span>
          {["All", "Pending", "In Progress", "Completed", "Overdue"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === st
                  ? "bg-[#722F37] text-white"
                  : "bg-[#F5F2EB] text-[#494C55] hover:bg-[#EDE8DF]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#757985] font-semibold">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="min-w-0 max-w-full px-2.5 py-1 rounded-lg bg-[#F5F2EB] border border-[#DCD7CE] text-[#121316] font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Content: LIST VIEW vs STATUS BOARD */}
      {viewMode === "list" ? (
        <div className="surface-card rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-[#F0ECE1]">
            {filteredTasks.map((t) => {
              const isDone = t.status === "Completed";
              return (
                <div
                  key={t.id}
                  className="p-4 hover:bg-[#FBF9F5] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(t.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        isDone
                          ? "bg-[#E8F0EA] border-[#7AA188] text-[#29422F]"
                          : "border-[#DCD7CE] hover:border-[#722F37] bg-white text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <div className="min-w-0">
                      <div
                        className={`text-xs sm:text-sm font-bold transition-colors ${
                          isDone ? "text-[#365B45] decoration-0" : "text-[#121316]"
                        }`}
                      >
                        <span className="break-words">{t.title}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#757985] mt-1">
                        <span
                          onClick={() => handleOpenContact(t.contactId)}
                          className="min-w-0 font-semibold text-[#722F37] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <User className="w-3 h-3" />
                          <span className="break-words">{t.contactName} ({t.contactCompany})</span>
                        </span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-[#F5F2EB] text-[10px] font-semibold text-[#494C55]">
                          {t.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pl-8 lg:pl-0">
                    <div className="text-left lg:text-right">
                      <div
                        className={`text-xs font-semibold ${
                          t.status === "Overdue" ? "text-[#DC2626]" : "text-[#121316]"
                        }`}
                      >
                        {t.dueDate}
                      </div>
                      <StatusBadge status={t.status} size="sm" showDot={false} />
                    </div>

                    <StatusBadge status={t.priority} size="sm" className="shrink-0" />

                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1.5 rounded-lg text-[#CACCD2] hover:text-[#DC2626] hover:bg-[#FDF2F2] transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* STATUS BOARD (KANBAN) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Overdue", list: overdueTasks, color: "border-t-4 border-t-[#DC2626]" },
            { title: "Pending", list: pendingTasks, color: "border-t-4 border-t-[#C5A059]" },
            { title: "In Progress", list: inProgressTasks, color: "border-t-4 border-t-[#4A6B82]" },
            { title: "Completed", list: completedTasks, color: "border-t-4 border-t-[#4E6E55]" }
          ].map((col) => (
            <div
              key={col.title}
              className={`surface-card rounded-2xl p-4 flex flex-col justify-between ${col.color}`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1] mb-3">
                  <span className="text-xs font-bold text-[#121316] uppercase tracking-wider">
                    {col.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE8DF] text-[#494C55]">
                    {col.list.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {col.list.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-[#FBF9F5] border border-[#EBE6DC] text-xs hover:border-[#DDD4C4] transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`font-bold leading-snug ${t.status === "Completed" ? "text-[#4E6E55]" : "text-[#121316]"}`}>
                          {t.title}
                        </span>
                        <button
                          onClick={() => toggleTaskStatus(t.id)}
                          className="text-[#9C9FA8] hover:text-[#4E6E55]"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 text-[11px] text-[#757985]">
                        For: <strong className="text-[#121316]">{t.contactName}</strong>
                      </div>

                      <div className="mt-2 pt-2 border-t border-[#EDE8DF] flex items-center justify-between text-[10px]">
                        <span className="text-[#9C9FA8]">{t.dueDate}</span>
                        <StatusBadge status={t.priority} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
