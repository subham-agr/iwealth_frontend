import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Info } from "lucide-react";
import { DEFAULT_RANGE, getFundAnalytics } from "../api/fundApi";
import Card from "../components/ui/Card";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import MetricTile from "../components/ui/MetricTile";
import type { FundAnalytics } from "../types/fund";
import { CHART_COLORS, formatPercent, formatRatio } from "../utils/format";

const DEFAULT_SCHEME = "119551";
const DEFAULT_BENCHMARK = "NIFTY 100";

export default function FundAnalysis() {
  const [data, setData] = useState<FundAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await getFundAnalytics(
          DEFAULT_SCHEME,
          DEFAULT_BENCHMARK,
          DEFAULT_RANGE,
        );
        if (result.error) {
          setError(result.error);
          setData(null);
        } else {
          setData(result);
        }
      } catch {
        setError(
          "Could not reach the server. Make sure the backend is running on port 8000.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const growthChart = useMemo(() => {
    if (!data?.nav_series?.length) return [];

    const benchmarkMap = new Map(
      (data.benchmark_series ?? []).map((point) => [point.date, point.value]),
    );

    return data.nav_series.map((point) => ({
      date: point.date,
      fund: point.value,
      benchmark: benchmarkMap.get(point.date),
    }));
  }, [data]);

  if (loading) return <LoadingState message="Analyzing fund performance..." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <ErrorState message="No data available for this fund." />;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-indigo-600">Single fund deep-dive</p>
        <h2 className="text-2xl font-semibold text-slate-900">
          {data.fund_name ?? "Fund Analysis"}
        </h2>
        <p className="text-sm text-slate-500">
          Compared against {data.benchmark_name} · Plain-language summary for
          everyday investors
        </p>
      </header>

      {data.closest_indexer && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            This fund moves almost like its benchmark index. You may be paying
            active fund fees without getting much extra performance beyond the
            index.
          </p>
        </div>
      )}

      <Card
        title="How has it grown?"
        subtitle="Past returns — higher is better, but not a guarantee for the future"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricTile
            label="Past 1 year"
            value={formatPercent(data.returns["1y"])}
            hint={`Market (benchmark): ${formatPercent(data.benchmark_returns["1y"])}`}
            tone={
              (data.returns["1y"] ?? 0) >= (data.benchmark_returns["1y"] ?? 0)
                ? "positive"
                : "negative"
            }
          />
          <MetricTile
            label="Past 3 years (avg/year)"
            value={formatPercent(data.returns["3y"])}
            hint={`Market: ${formatPercent(data.benchmark_returns["3y"])}`}
          />
          <MetricTile
            label="Past 5 years (avg/year)"
            value={formatPercent(data.returns["5y"])}
            hint={`Market: ${formatPercent(data.benchmark_returns["5y"])}`}
          />
        </div>
      </Card>

      {growthChart.length > 0 && (
        <Card
          title="Growth over time"
          subtitle="If you had invested ₹100 at the start, this is how it would have moved (fund vs market)"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="fund"
                  name="This fund"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name="Market benchmark"
                  stroke={CHART_COLORS[1]}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="Ups & downs vs the market"
          subtitle="Above 100% means the fund captured more of the market's moves"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricTile
              label="When market rose"
              value={formatRatio(data.capture_ratio.upside_capture)}
              hint="How much of the market's gains the fund kept"
            />
            <MetricTile
              label="When market fell"
              value={formatRatio(data.capture_ratio.downside_capture)}
              hint="Lower can mean smaller losses in downturns"
            />
          </div>
        </Card>

        <Card
          title="Annual fee (expense ratio)"
          subtitle="What the fund charges each year — lower leaves more in your pocket"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricTile
              label="Direct plan"
              value={data.ter?.direct_ter !== null && data.ter?.direct_ter !== undefined ? formatPercent(data.ter.direct_ter) : "—"}
              hint="Usually cheapest if you buy without an advisor"
            />
            <MetricTile
              label="Regular plan"
              value={data.ter?.regular_ter !== null && data.ter?.regular_ter !== undefined ? formatPercent(data.ter.regular_ter) : "—"}
              hint="Often higher due to distributor commission"
            />
          </div>
        </Card>
      </div>

      <Card
        title="Best & worst 12-month periods"
        subtitle="Shows how bumpy the ride can be — useful for setting expectations"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricTile
            label="Best 12 months"
            value={formatPercent(data.rolling_returns.best)}
            tone="positive"
          />
          <MetricTile
            label="Typical 12 months"
            value={formatPercent(data.rolling_returns.median)}
          />
          <MetricTile
            label="Worst 12 months"
            value={formatPercent(data.rolling_returns.worst)}
            tone="negative"
          />
        </div>
        {data.max_drawdown != null && (
          <p className="mt-4 text-sm text-slate-500">
            Biggest drop from a peak:{" "}
            <span className="font-medium text-rose-600">
              {formatPercent(data.max_drawdown)}
            </span>{" "}
            — the largest fall before recovering.
          </p>
        )}
      </Card>
    </div>
  );
}
