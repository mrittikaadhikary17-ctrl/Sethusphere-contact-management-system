import React from "react";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  trend = "up", // 'up' | 'down' | 'neutral'
  icon: Icon,
  badgeText,
  variant = "default", // 'default' | 'wine' | 'gold' | 'sage'
  onClick
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "wine":
        return {
          iconBg: "bg-[#722F37]/10 text-[#722F37]",
          accentLine: "border-l-4 border-l-[#722F37]"
        };
      case "gold":
        return {
          iconBg: "bg-[#C5A059]/15 text-[#9B7830]",
          accentLine: "border-l-4 border-l-[#C5A059]"
        };
      case "sage":
        return {
          iconBg: "bg-[#4E6E55]/10 text-[#38533E]",
          accentLine: "border-l-4 border-l-[#4E6E55]"
        };
      default:
        return {
          iconBg: "bg-[#121316]/5 text-[#121316]",
          accentLine: ""
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl surface-card p-5 surface-card-hover ${
        onClick ? "cursor-pointer" : ""
      } ${vStyles.accentLine}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#757985]">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold font-sans tracking-tight text-[#121316] tabular-nums">
              {value}
            </span>
            {badgeText && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3EB] text-[#A24A1B] border border-[#F8D2B9]">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div
            className={`p-2.5 rounded-lg shrink-0 ${vStyles.iconBg}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3.5 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs text-[#757985]">
        {change && (
          <div className="flex items-center gap-1">
            {trend === "up" ? (
              <span className="inline-flex items-center text-[#38533E] font-medium gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {change}
              </span>
            ) : trend === "down" ? (
              <span className="inline-flex items-center text-[#DC2626] font-medium gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                {change}
              </span>
            ) : (
              <span className="font-medium text-[#494C55]">{change}</span>
            )}
            <span className="text-[#9C9FA8]">vs last month</span>
          </div>
        )}

        {subtitle && !change && (
          <span className="text-xs font-medium text-[#757985]">{subtitle}</span>
        )}

        {onClick && (
          <ArrowUpRight className="w-3.5 h-3.5 text-[#9C9FA8] group-hover:text-[#121316] ml-auto transition-colors" />
        )}
      </div>
    </div>
  );
}
