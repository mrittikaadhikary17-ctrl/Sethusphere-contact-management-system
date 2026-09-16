import React from "react";

export function HealthScoreGauge({ score, size = "md", showLabel = true }) {
  // Score range 0-100
  const normalizedScore = Math.max(0, Math.min(100, score || 0));

  const getColor = (s) => {
    if (s >= 85) return { stroke: "#4E6E55", text: "text-[#29422F]", bg: "bg-[#E8F0EA]", label: "Healthy" };
    if (s >= 60) return { stroke: "#D97736", text: "text-[#873812]", bg: "bg-[#FEF3EB]", label: "Needs Attention" };
    if (s >= 30) return { stroke: "#DC2626", text: "text-[#991B1B]", bg: "bg-[#FDF2F2]", label: "At Risk" };
    return { stroke: "#9C968D", text: "text-[#6B665E]", bg: "bg-[#F0EEEA]", label: "Inactive" };
  };

  const config = getColor(normalizedScore);

  if (size === "sm") {
    return (
      <div className="inline-flex items-center gap-1.5 font-sans">
        <div className="relative w-6 h-6 flex items-center justify-center">
          <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#EDE8DF]"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              strokeDasharray={`${normalizedScore}, 100`}
              strokeWidth="4"
              strokeLinecap="round"
              stroke={config.stroke}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
        <span className={`text-xs font-semibold tabular-nums ${config.text}`}>
          {normalizedScore}
        </span>
      </div>
    );
  }

  if (size === "lg") {
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#E8E2D5]"
              strokeWidth="3.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="transition-all duration-700 ease-out"
              strokeDasharray={`${normalizedScore}, 100`}
              strokeWidth="3.2"
              strokeLinecap="round"
              stroke={config.stroke}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold font-sans tracking-tight text-[#121316]">
              {normalizedScore}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#757985]">
              Health
            </span>
          </div>
        </div>
        {showLabel && (
          <span
            className={`mt-2.5 px-3 py-0.5 rounded-full text-xs font-semibold tracking-tight border ${config.bg} ${config.text} border-current/20`}
          >
            {config.label}
          </span>
        )}
      </div>
    );
  }

  // Default "md"
  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-[#EFEAE1]"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            strokeDasharray={`${normalizedScore}, 100`}
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke={config.stroke}
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className={`absolute text-xs font-bold tabular-nums ${config.text}`}>
          {normalizedScore}
        </span>
      </div>
      {showLabel && (
        <span className={`text-xs font-medium ${config.text}`}>
          {config.label}
        </span>
      )}
    </div>
  );
}
