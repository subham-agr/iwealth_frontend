import { useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Lightbulb } from "lucide-react";
import Card from "../components/ui/Card";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import MetricTile from "../components/ui/MetricTile";
import type { PortfolioOverview as PortfolioData } from "../types/fund";
import { CHART_COLORS, formatCurrency, formatPercent } from "../utils/format";

const riskColors: Record<string, string> = {
  Low: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-rose-100 text-rose-700",
  Unknown: "bg-slate-100 text-slate-600",
};

// Dummy data
const dummyPortfolioData: PortfolioData = {
  total_value: 1250000,
  return_1y: 12.5,
  benchmark_return_1y: 8.2,
  alpha: 4.3,
  risk_level: "Medium",
  allocation: [
    { name: "Large Cap Equity", value: 35 },
    { name: "Mid Cap Equity", value: 25 },
    { name: "Debt/Bonds", value: 30 },
    { name: "Hybrid", value: 10 },
  ],
  holdings: [
    {
      scheme_code: "120503",
      scheme_name: "Nippon India Liquid Fund - Growth",
      allocation_pct: 20,
      return_1y: 5.8,
      contribution_pct: 1.2,
      risk: "Low",
      asset_class: "Liquid",
    },
    {
      scheme_code: "122639",
      scheme_name: "ICICI Prudential Nifty 50 Index Fund",
      allocation_pct: 35,
      return_1y: 15.2,
      contribution_pct: 5.8,
      risk: "High",
      asset_class: "Large Cap Equity",
    },
    {
      scheme_code: "106956",
      scheme_name: "Axis Mid-Cap Fund - Growth",
      allocation_pct: 25,
      return_1y: 18.5,
      contribution_pct: 4.2,
      risk: "High",
      asset_class: "Mid Cap Equity",
    },
    {
      scheme_code: "120484",
      scheme_name: "HDFC Corporate Bond Fund - Growth",
      allocation_pct: 20,
      return_1y: 8.2,
      contribution_pct: 1.8,
      risk: "Low",
      asset_class: "Debt",
    },
  ],
  insights: [
    "Your portfolio beat the market by 4.3% this year—solid work!",
    "Equity holdings drove most of your gains; they make up 60% of your portfolio.",
    "Your debt allocation is protecting you from sharp downturns.",
    "Consider rebalancing soon—equity weight has grown to 60% from 50% target.",
  ],
};

export default function PortfolioOverview() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setData(dummyPortfolioData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingState message="Building your portfolio snapshot..." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <ErrorState message="No portfolio data available." />;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-indigo-600">Your money at a glance</p>
        <h2 className="text-2xl font-semibold text-slate-900">Portfolio Overview</h2>
        <p className="text-sm text-slate-500">
          Demo portfolio with live fund data — see where your money sits and how
          it&apos;s doing
        </p>
      </header>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            label="Total value"
            value={formatCurrency(data.total_value)}
            hint="Combined value of all holdings"
          />
          <MetricTile
            label="Past 1 year growth"
            value={formatPercent(data.return_1y)}
            tone={data.return_1y >= 0 ? "positive" : "negative"}
          />
          <MetricTile
            label="Market (benchmark)"
            value={formatPercent(data.benchmark_return_1y)}
            hint="How a typical market index did"
          />
          <MetricTile
            label="Extra vs market"
            value={formatPercent(data.alpha)}
            hint="Positive means you beat the market"
            tone={data.alpha >= 0 ? "positive" : "negative"}
          />
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Overall risk feel:{" "}
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${riskColors[data.risk_level] ?? riskColors.Unknown}`}
          >
            {data.risk_level}
          </span>{" "}
          — based on how much each fund has dropped in the past
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="Where your money is"
          subtitle="Mix of equity (stocks), debt (bonds), hybrid, and cash"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.allocation}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {data.allocation.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Plain-English insights"
          subtitle="Quick takeaways — no spreadsheet needed"
        >
          <ul className="space-y-3">
            {data.insights.map((insight, index) => (
              <li
                key={index}
                className="flex gap-3 rounded-xl bg-indigo-50 p-3 text-sm text-slate-700"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card
        title="Your holdings"
        subtitle="Each fund's share, recent growth, and how much it added to the portfolio"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 pr-4 font-medium">Fund</th>
                <th className="py-3 pr-4 font-medium">Share</th>
                <th className="py-3 pr-4 font-medium">1Y growth</th>
                <th className="py-3 pr-4 font-medium">Contribution</th>
                <th className="py-3 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {data.holdings.map((holding) => (
                <tr key={holding.scheme_code} className="border-b border-slate-100">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-slate-900">
                      {holding.scheme_name}
                    </p>
                    <p className="text-xs text-slate-500">{holding.asset_class}</p>
                  </td>
                  <td className="py-4 pr-4 font-medium">
                    {holding.allocation_pct}%
                  </td>
                  <td className="py-4 pr-4 font-medium">
                    {formatPercent(holding.return_1y)}
                  </td>
                  <td className="py-4 pr-4 font-medium">
                    {formatPercent(holding.contribution_pct)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${riskColors[holding.risk] ?? riskColors.Unknown}`}
                    >
                      {holding.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
