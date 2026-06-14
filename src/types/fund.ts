export interface ReturnsBlock {
  "1y": number | null;
  "3y": number | null;
  "5y": number | null;
}

export interface RollingReturns {
  best: number | null;
  worst: number | null;
  median: number | null;
}

export interface CaptureRatio {
  upside_capture: number | null;
  downside_capture: number | null;
}

export interface TerInfo {
  scheme_name?: string;
  regular_ter: number | null;
  direct_ter: number | null;
  ter_date?: string;
}

export interface NavPoint {
  date: string;
  value: number;
}

export interface FundAnalytics {
  scheme_code?: string;
  fund_name?: string;
  benchmark_name?: string;
  returns: ReturnsBlock;
  benchmark_returns: ReturnsBlock;
  rolling_returns: RollingReturns;
  max_drawdown?: number | null;
  capture_ratio: CaptureRatio;
  closest_indexer: boolean;
  ter: TerInfo;
  nav_series?: NavPoint[];
  benchmark_series?: NavPoint[];
  error?: string;
}

export interface CompareFund {
  scheme_code: string;
  scheme_name: string;
  returns?: ReturnsBlock;
  benchmark_returns?: ReturnsBlock;
  max_drawdown?: number | null;
  ter?: TerInfo;
  nav_series?: NavPoint[];
  error?: string;
}

export interface CompareResponse {
  benchmark_name: string;
  start_date: string;
  end_date: string;
  funds: CompareFund[];
  nav_chart: Record<string, string | number>[];
}

export interface PortfolioHolding {
  scheme_code: string;
  scheme_name: string;
  allocation_pct: number;
  return_1y: number;
  contribution_pct: number;
  risk: string;
  asset_class: string;
}

export interface PortfolioOverview {
  total_value: number;
  return_1y: number;
  benchmark_return_1y: number;
  alpha: number;
  risk_level: string;
  allocation: { name: string; value: number }[];
  holdings: PortfolioHolding[];
  insights: string[];
  error?: string;
}

export interface FundSummary {
  scheme_code: string;
  scheme_name: string;
  nav?: string;
  category?: string;
}
