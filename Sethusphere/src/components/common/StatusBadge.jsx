import React from "react";

export function StatusBadge({ status, size = "md", showDot = true, className = "" }) {
  const getStyles = () => {
    switch (status) {
      case "Healthy":
        return {
          bg: "bg-[#E8F0EA]",
          text: "text-[#29422F]",
          border: "border-[#CFDFD2]",
          dot: "bg-[#4E6E55]"
        };
      case "Needs Attention":
        return {
          bg: "bg-[#FEF3EB]",
          text: "text-[#873812]",
          border: "border-[#F8D2B9]",
          dot: "bg-[#D97736]"
        };
      case "At Risk":
        return {
          bg: "bg-[#FDF2F2]",
          text: "text-[#991B1B]",
          border: "border-[#FCA5A5]",
          dot: "bg-[#DC2626]"
        };
      case "Inactive":
        return {
          bg: "bg-[#F0EEEA]",
          text: "text-[#6B665E]",
          border: "border-[#DCD7CE]",
          dot: "bg-[#9C968D]"
        };
      case "High":
        return {
          bg: "bg-[#F7E4E7]",
          text: "text-[#722F37]",
          border: "border-[#ECC7CC]",
          dot: "bg-[#8B2635]"
        };
      case "Medium":
        return {
          bg: "bg-[#FEF3EB]",
          text: "text-[#9A3412]",
          border: "border-[#FCD34D]",
          dot: "bg-[#EA580C]"
        };
      case "Low":
        return {
          bg: "bg-[#EBF1F5]",
          text: "text-[#253947]",
          border: "border-[#BFD3E0]",
          dot: "bg-[#4A6B82]"
        };
      case "Completed":
        return {
          bg: "bg-[#E8F0EA]",
          text: "text-[#29422F]",
          border: "border-[#CFDFD2]",
          dot: "bg-[#4E6E55]"
        };
      case "Pending":
        return {
          bg: "bg-[#F7F1E1]",
          text: "text-[#7D5E1E]",
          border: "border-[#EEDDB8]",
          dot: "bg-[#C5A059]"
        };
      case "In Progress":
        return {
          bg: "bg-[#EBF1F5]",
          text: "text-[#2B4B64]",
          border: "border-[#BFD3E0]",
          dot: "bg-[#4A6B82]"
        };
      case "Overdue":
        return {
          bg: "bg-[#FDF2F2]",
          text: "text-[#991B1B]",
          border: "border-[#FCA5A5]",
          dot: "bg-[#DC2626]"
        };
      default:
        return {
          bg: "bg-[#F0EEEA]",
          text: "text-[#4A4742]",
          border: "border-[#E2DBD0]",
          dot: "bg-[#757985]"
        };
    }
  };

  const config = getStyles();
  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[11px] font-medium tracking-tight"
      : "px-2.5 py-1 text-xs font-semibold tracking-tight";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`}
        />
      )}
      <span>{status}</span>
    </span>
  );
}

export function CategoryBadge({ category, className = "" }) {
  const getStyles = () => {
    switch (category) {
      case "Client":
        return "bg-[#F7E4E7] text-[#722F37] border-[#ECC7CC]";
      case "Lead":
        return "bg-[#FEF3EB] text-[#A24A1B] border-[#F8D2B9]";
      case "Partner":
        return "bg-[#EBF1F5] text-[#2B4B64] border-[#BFD3E0]";
      case "VIP":
        return "bg-[#FBF8F0] text-[#8C6D27] border-[#EEDDB8] font-semibold";
      case "Vendor":
        return "bg-[#E8F0EA] text-[#29422F] border-[#CFDFD2]";
      case "Employee":
        return "bg-[#F0EEEA] text-[#313339] border-[#DCD7CE]";
      default:
        return "bg-[#F0EEEA] text-[#4A4742] border-[#E2DBD0]";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium tracking-tight border ${getStyles()} ${className}`}
    >
      {category}
    </span>
  );
}
