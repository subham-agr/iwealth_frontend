import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../components/ui/Card";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import type { CompareFund, CompareResponse } from "../types/fund";
import { CHART_COLORS, formatPercent } from "../utils/format";

// Dummy comparison data
const dummyCompareData: CompareResponse = {
  benchmark_name: "NIFTY 100",
  start_date: "2021-01-01",
  end_date: "2021-08-01",
  funds: [
    {
      scheme_code: "122639",
      scheme_name: "ICICI Prudential Nifty 50 Index Fund",
      returns: {
        "1y": 15.2,
        "3y": 14.8,
        "5y": 13.5,
      },
      benchmark_returns: {
        "1y": 12.5,
        "3y": 11.8,
        "5y": 10.2,
      },
      max_drawdown: -8.5,
      ter: {
        scheme_name: "ICICI Prudential Nifty 50 Index Fund",
        regular_ter: 0.5,
        direct_ter: 0.25,
        ter_date: "2024-12-31",
      },
      nav_series: [
        { date: "2021-01-01", value: 100 },
        { date: "2021-02-15", value: 105.2 },
        { date: "2021-04-01", value: 112.5 },
        { date: "2021-06-15", value: 118.8 },
        { date: "2021-08-01", value: 125.3 },
      ],
    },
    {
      scheme_code: "120503",
      scheme_name: "Nippon India Liquid Fund - Growth",
      returns: {
        "1y": 5.8,
        "3y": 6.2,
        "5y": 6.8,
      },
      benchmark_returns: {
        "1y": 4.5,
        "3y": 4.8,
        "5y": 5.2,
      },
      max_drawdown: -2.3,
      ter: {
        scheme_name: "Nippon India Liquid Fund - Growth",
        regular_ter: 0.35,
        direct_ter: 0.15,
        ter_date: "2024-12-31",
      },
      nav_series: [
        { date: "2021-01-01", value: 100 },
        { date: "2021-02-15", value: 101.2 },
        { date: "2021-04-01", value: 102.8 },
        { date: "2021-06-15", value: 103.9 },
        { date: "2021-08-01", value: 105.2 },
      ],
    },
  ],
  nav_chart: [
    {
      date: "2021-01-01",
      fund_122639: 100,
      fund_120503: 100,
      benchmark: 100,
    },
    {
      date: "2021-02-15",
      fund_122639: 105.2,
      fund_120503: 101.2,
      benchmark: 102.5,
    },
    {
      date: "2021-04-01",
      fund_122639: 112.5,
      fund_120503: 102.8,
      benchmark: 108.3,
    },
    {
      date: "2021-06-15",
      fund_122639: 118.8,
      fund_120503: 103.9,
      benchmark: 113.6,
    },
    {
      date: "2021-08-01",
      fund_122639: 125.3,
      fund_120503: 105.2,
      benchmark: 118.2,
    },
  ],
};

const FUND_A = "122639";
const FUND_B = "120503";
const BENCHMARK = "NIFTY 100";

export default function FundComparison() {
  const [data, setData] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setData(dummyCompareData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const funds = useMemo(
    () => (data?.funds ?? []).filter((fund) => !fund.error) as CompareFund[],
    [data],
  );

  const metrics = useMemo(() => {
    if (funds.length < 2) return [];

    return [
      {
        label: "Past 3 years",
        fundA: funds[0].returns?.["3y"],
        fundB: funds[1].returns?.["3y"],
        unit: "%",
        description: "Average yearly growth over 3 years",
      },
      {
        label: "Biggest drop",
        fundA: funds[0].max_drawdown,
        fundB: funds[1].max_drawdown,
        unit: "%",
        description: "Largest fall from a peak — closer to 0 is milder",
      },
      {
        label: "Annual fee (direct)",
        fundA: funds[0].ter?.direct_ter,
        fundB: funds[1].ter?.direct_ter,
        unit: "%",
        description: "Lower fee means more stays invested",
      },
    ];
  }, [funds]);

  const returnBarData = useMemo(
    () =>
      metrics.map((metric) => ({
        label: metric.label,
        [funds[0]?.scheme_name ?? "Fund A"]: metric.fundA,
        [funds[1]?.scheme_name ?? "Fund B"]: metric.fundB,
      })),
    [metrics, funds],
  );

  const lineKeys = useMemo(() => {
    if (!data?.nav_chart.length) return [];
    return Object.keys(data.nav_chart[0]).filter((key) => key.startsWith("fund_"));
  }, [data]);

  if (loading) return <LoadingState message="Comparing funds side by side..." />;
  if (error) return <ErrorState message={error} />;
  if (!data || funds.length < 2) {
    return <ErrorState message="Not enough data to compare these funds." />;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-indigo-600">Side-by-side view</p>
        <h2 className="text-2xl font-semibold text-slate-900">Compare Funds</h2>
        <p className="text-sm text-slate-500">
          See how two funds stack up — no finance jargon required
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {funds.map((fund, index) => (
          <div
            key={fund.scheme_code}
            className="rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm"
            style={{ borderLeftColor: CHART_COLORS[index] }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Fund {index + 1}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              {fund.scheme_name}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              1-year growth:{" "}
              <span className="font-medium text-slate-800">
                {formatPercent(fund.returns?.["1y"])}
              </span>
            </p>
          </div>
        ))}
      </div>

      <Card
        title="Growth journey (₹100 starting point)"
        subtitle="Both funds normalized so you can compare shape, not absolute price"
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.nav_chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {lineKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={funds[index]?.scheme_name ?? `Fund ${index + 1}`}
                  stroke={CHART_COLORS[index]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card
        title="Key numbers at a glance"
        subtitle="Tap-friendly table — green numbers aren't guarantees, just history"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 pr-4 font-medium">What we measured</th>
                <th className="py-3 pr-4 font-medium">{funds[0].scheme_name}</th>
                <th className="py-3 font-medium">{funds[1].scheme_name}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.label} className="border-b border-slate-100">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-slate-900">{metric.label}</p>
                    <p className="text-xs text-slate-500">{metric.description}</p>
                  </td>
                  <td className="py-4 pr-4 font-semibold text-slate-800">
                    {metric.fundA != null ? `${metric.fundA}${metric.unit}` : "—"}
                  </td>
                  <td className="py-4 font-semibold text-slate-800">
                    {metric.fundB != null ? `${metric.fundB}${metric.unit}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Visual comparison" subtitle="Bars make differences easier to spot">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={returnBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey={funds[0].scheme_name} fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
              <Bar dataKey={funds[1].scheme_name} fill={CHART_COLORS[1]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
