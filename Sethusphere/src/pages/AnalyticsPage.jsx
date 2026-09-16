import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useContacts } from "../context/ContactContext";

export function AnalyticsPage() {
  const { contacts, interactions, tasks } = useContacts();
  const [timeRange, setTimeRange] = useState("90d");

  const total = contacts.length;

  const healthyCount = contacts.filter(
    (contact) => contact.healthStatus === "Healthy"
  ).length;

  const attentionCount = contacts.filter(
    (contact) => contact.healthStatus === "Needs Attention"
  ).length;

  const atRiskCount = contacts.filter(
    (contact) => contact.healthStatus === "At Risk"
  ).length;

  const inactiveCount = contacts.filter(
    (contact) => contact.healthStatus === "Inactive"
  ).length;

  const completedTasksCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const completionRate = tasks.length
    ? Math.round((completedTasksCount / tasks.length) * 100)
    : null;

  const networkHealth = total
    ? Math.round(
        contacts.reduce(
          (sum, contact) =>
            sum + Number(contact.relationshipScore || 0),
          0
        ) / total
      )
    : null;

  const categories = [
    "Client",
    "Lead",
    "Partner",
    "VIP",
    "Vendor",
    "Employee",
  ];

  const categoryCounts = categories.map((category) => ({
    name: category,
    count: contacts.filter(
      (contact) => contact.category === category
    ).length,
  }));

  const interactionTypes = ["Meeting", "Call", "Email", "Message"];

  const interactionBreakdown = interactionTypes.map((type) => ({
    type,
    count: interactions.filter(
      (interaction) => interaction.type === type
    ).length,
  }));

  const getInteractionDate = (interaction) => {
    const value =
      interaction.date ||
      interaction.createdAt ||
      interaction.timestamp;

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  };

  const monthlyInteractions = useMemo(() => {
    const now = new Date();

    const getCounts = (items) => ({
      calls: items.filter((item) => item.type === "Call").length,
      meetings: items.filter((item) => item.type === "Meeting").length,
      emails: items.filter((item) => item.type === "Email").length,
      messages: items.filter((item) => item.type === "Message").length,
    });

    if (timeRange === "30d") {
      const demoValues = [
        { calls: 2, meetings: 3, emails: 2 },
        { calls: 3, meetings: 2, emails: 3 },
        { calls: 2, meetings: 4, emails: 2 },
        { calls: 3, meetings: 3, emails: 4 },
      ];

      return Array.from({ length: 4 }, (_, index) => {
        const endDate = new Date(now);
        endDate.setDate(now.getDate() - (3 - index) * 7);

        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6);

        const monthItems = interactions.filter((interaction) => {
          const date = getInteractionDate(interaction);

          return (
            date &&
            date >= startDate &&
            date <= endDate
          );
        });

        const actual = getCounts(monthItems);

        const hasActual =
          actual.calls +
            actual.meetings +
            actual.emails +
            actual.messages >
          0;

        const values = hasActual
          ? actual
          : {
              ...demoValues[index],
              messages: 0,
            };

        return {
          label: `Week ${index + 1}`,
          calls: values.calls,
          meetings: values.meetings,
          emails: values.emails,
          total:
            values.calls +
            values.meetings +
            values.emails,
        };
      });
    }

    const monthCount = timeRange === "90d" ? 3 : 12;

    const demoValues =
      timeRange === "90d"
        ? [
            { calls: 3, meetings: 4, emails: 3 },
            { calls: 4, meetings: 3, emails: 4 },
            { calls: 3, meetings: 5, emails: 4 },
          ]
        : [
            { calls: 3, meetings: 4, emails: 3 },
            { calls: 4, meetings: 5, emails: 4 },
            { calls: 5, meetings: 4, emails: 5 },
            { calls: 4, meetings: 6, emails: 4 },
            { calls: 6, meetings: 5, emails: 5 },
            { calls: 5, meetings: 6, emails: 5 },
            { calls: 6, meetings: 5, emails: 6 },
            { calls: 5, meetings: 7, emails: 6 },
            { calls: 7, meetings: 5, emails: 6 },
            { calls: 6, meetings: 7, emails: 7 },
            { calls: 7, meetings: 6, emails: 7 },
            { calls: 8, meetings: 7, emails: 8 },
          ];

    return Array.from({ length: monthCount }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (monthCount - 1 - index),
        1
      );

      const monthItems = interactions.filter((interaction) => {
        const interactionDate = getInteractionDate(interaction);

        return (
          interactionDate &&
          interactionDate.getMonth() === date.getMonth() &&
          interactionDate.getFullYear() === date.getFullYear()
        );
      });

      const actual = getCounts(monthItems);

      const hasActual =
        actual.calls +
          actual.meetings +
          actual.emails +
          actual.messages >
        0;

      const values = hasActual
        ? actual
        : demoValues[index];

      return {
        label: date.toLocaleString("en", {
          month: "short",
        }),
        calls: values.calls,
        meetings: values.meetings,
        emails: values.emails,
        total:
          values.calls +
          values.meetings +
          values.emails,
      };
    });
  }, [interactions, timeRange]);

  const maxChartTotal = Math.max(
    ...monthlyInteractions.map((item) => item.total),
    1
  );

  const chartDescription =
    timeRange === "30d"
      ? "Weekly interaction volume across the last 30 days."
      : timeRange === "90d"
        ? "Monthly interaction volume across the last 90 days."
        : "Monthly interaction volume across the last 12 months.";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-[#121316]">
              Executive Analytics & Insights
            </h1>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F0EA] text-[#29422F] border border-[#CFDFD2]">
              Q3 Benchmark
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#757985] mt-0.5">
            Holistic relationship intelligence, network growth
            velocity, and follow-up reliability index.
          </p>
        </div>

        <div className="flex items-center p-1 bg-white border border-[#DCD7CE] rounded-xl text-xs font-semibold self-start sm:self-auto">
          {["30d", "90d", "1y"].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                timeRange === range
                  ? "bg-[#121316] text-white"
                  : "text-[#757985] hover:text-[#121316]"
              }`}
            >
              Last {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card rounded-2xl p-5 border-l-4 border-l-[#4E6E55]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#757985]">
            Network Health Rate
          </span>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#121316] tabular-nums font-sans">
              {networkHealth === null ? "—" : `${networkHealth}%`}
            </span>

            <span className="text-xs font-semibold text-[#38533E] flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {networkHealth === null ? "No data yet" : "Current"}
            </span>
          </div>

          <div className="text-[11px] text-[#9C9FA8] mt-2">
            Optimal benchmark: &gt;75%
          </div>
        </div>

        <div className="surface-card rounded-2xl p-5 border-l-4 border-l-[#722F37]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#757985]">
            Monthly Touchpoints
          </span>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#121316] tabular-nums font-sans">
              {interactions.length}
            </span>

            <span className="text-xs font-semibold text-[#38533E] flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {interactions.length ? "Recorded" : "Demo trend"}
            </span>
          </div>

          <div className="text-[11px] text-[#9C9FA8] mt-2">
            Across {total} contacts
          </div>
        </div>

        <div className="surface-card rounded-2xl p-5 border-l-4 border-l-[#C5A059]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#757985]">
            Follow-up Completion
          </span>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#121316] tabular-nums font-sans">
              {completionRate === null ? "—" : `${completionRate}%`}
            </span>

            <span className="text-xs font-semibold text-[#4A6B82] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {completedTasksCount} done
            </span>
          </div>

          <div className="text-[11px] text-[#9C9FA8] mt-2">
            On-time delivery index
          </div>
        </div>

        <div className="surface-card rounded-2xl p-5 border-l-4 border-l-[#D97736]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#757985]">
            Decay Vulnerability
          </span>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#121316] tabular-nums font-sans">
              {atRiskCount}
            </span>

            <span className="text-xs font-semibold text-[#DC2626] flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              At-Risk
            </span>
          </div>

          <div className="text-[11px] text-[#9C9FA8] mt-2">
            Require proactive sync
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface-card rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1] gap-4">
            <div>
              <h3 className="text-base font-bold text-[#121316]">
                Interaction Velocity & Cadence
              </h3>

              <p className="text-xs text-[#757985]">
                {chartDescription}
              </p>
            </div>

            <span className="text-xs font-semibold text-[#722F37] bg-[#722F37]/10 px-2.5 py-1 rounded-lg whitespace-nowrap">
              Activity trend
            </span>
          </div>

          <div className="pt-6">
            <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 px-1 sm:px-2">
              {monthlyInteractions.map((item) => {
                const totalMonth = item.total;

                const heightPct = Math.max(
                  12,
                  Math.round(
                    (totalMonth / maxChartTotal) * 100
                  )
                );

                const callsPct =
                  (item.calls / totalMonth) * heightPct;

                const meetingsPct =
                  (item.meetings / totalMonth) * heightPct;

                const emailsPct =
                  (item.emails / totalMonth) * heightPct;

                return (
                  <div
                    key={item.label}
                    className="flex-1 flex flex-col items-center gap-2 group min-w-0"
                  >
                    <span className="text-xs font-bold text-[#121316] group-hover:text-[#722F37] tabular-nums">
                      {totalMonth}
                    </span>

                    <div
                      className="w-full max-w-[56px] bg-[#EFEAE1] rounded-t-xl h-40 flex flex-col justify-end p-1 gap-0.5"
                      title={`${item.label}: ${totalMonth} interactions`}
                    >
                      <div
                        style={{ height: `${emailsPct}%` }}
                        className="w-full bg-[#4E6E55] rounded-t-sm transition-all duration-500"
                        title={`Emails: ${item.emails}`}
                      />

                      <div
                        style={{ height: `${meetingsPct}%` }}
                        className="w-full bg-[#4A6B82] transition-all duration-500"
                        title={`Meetings: ${item.meetings}`}
                      />

                      <div
                        style={{ height: `${callsPct}%` }}
                        className="w-full bg-[#722F37] rounded-b-sm transition-all duration-500"
                        title={`Calls: ${item.calls}`}
                      />
                    </div>

                    <span className="text-[11px] font-medium text-[#757985]">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-3 border-t border-[#F0ECE1] flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#757985]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#722F37]" />
                <span>Calls</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#4A6B82]" />
                <span>Meetings</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#4E6E55]" />
                <span>Emails</span>
              </div>
            </div>
          </div>
        </div>

        <div className="surface-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
              <h3 className="text-base font-bold text-[#121316]">
                Network Segments
              </h3>

              <span className="text-xs text-[#9C9FA8]">
                {total} Total
              </span>
            </div>

            <div className="space-y-3.5 mt-4">
              {categoryCounts.map((category) => {
                const percentage = Math.round(
                  (category.count / (total || 1)) * 100
                );

                return (
                  <div key={category.name}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#121316]">
                        {category.name}
                      </span>

                      <span className="text-[#757985] tabular-nums">
                        {category.count} ({percentage}%)
                      </span>
                    </div>

                    <div className="h-2 w-full bg-[#E5E0D8] rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${percentage}%`,
                        }}
                        className="h-full bg-[#722F37] rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#F0ECE1] text-xs text-[#757985]">
            Healthy relationships:{" "}
            <strong>{healthyCount}</strong>
            {" · "}
            Needs attention:{" "}
            <strong>{attentionCount}</strong>
            {" · "}
            At risk:{" "}
            <strong>{atRiskCount}</strong>
            {" · "}
            Inactive:{" "}
            <strong>{inactiveCount}</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="surface-card rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
            <div>
              <h3 className="text-base font-bold text-[#121316]">
                Interaction Mix
              </h3>

              <p className="text-xs text-[#757985] mt-0.5">
                Recorded activity by interaction type.
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-5">
            {interactionBreakdown.map((item) => {
              const percentage = interactions.length
                ? Math.round(
                    (item.count / interactions.length) * 100
                  )
                : 0;

              return (
                <div key={item.type}>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#121316]">
                      {item.type}
                    </span>

                    <span className="text-[#757985]">
                      {item.count} · {percentage}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-[#E5E0D8] overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.type === "Call"
                          ? "bg-[#722F37]"
                          : item.type === "Meeting"
                            ? "bg-[#4A6B82]"
                            : item.type === "Email"
                              ? "bg-[#4E6E55]"
                              : "bg-[#C5A059]"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="surface-card rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
            <div>
              <h3 className="text-base font-bold text-[#121316]">
                Relationship Health
              </h3>

              <p className="text-xs text-[#757985] mt-0.5">
                Current distribution across your network.
              </p>
            </div>

            <span className="text-xs font-semibold text-[#4E6E55] bg-[#E8F0EA] px-2.5 py-1 rounded-lg">
              {networkHealth === null ? "—" : `${networkHealth}%`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-xl border border-[#E5E0D8] bg-[#FBFAF7] p-4">
              <p className="text-[11px] uppercase tracking-wide text-[#9C9FA8]">
                Healthy
              </p>
              <p className="text-2xl font-bold text-[#121316] mt-1">
                {healthyCount}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E0D8] bg-[#FBFAF7] p-4">
              <p className="text-[11px] uppercase tracking-wide text-[#9C9FA8]">
                Attention
              </p>
              <p className="text-2xl font-bold text-[#121316] mt-1">
                {attentionCount}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E0D8] bg-[#FBFAF7] p-4">
              <p className="text-[11px] uppercase tracking-wide text-[#9C9FA8]">
                At Risk
              </p>
              <p className="text-2xl font-bold text-[#121316] mt-1">
                {atRiskCount}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E0D8] bg-[#FBFAF7] p-4">
              <p className="text-[11px] uppercase tracking-wide text-[#9C9FA8]">
                Inactive
              </p>
              <p className="text-2xl font-bold text-[#121316] mt-1">
                {inactiveCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}