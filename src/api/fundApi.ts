import axios from "axios";
import type {
  CompareResponse,
  FundAnalytics,
  FundSummary,
  PortfolioOverview,
} from "../types/fund";

export const api = axios.create({
  baseURL: "https://iwealth-backend.onrender.com",
});

export interface DateRange {
  startDate: string;
  endDate: string;
}

export const DEFAULT_RANGE: DateRange = {
  startDate: "2021-01-01",
  endDate: "2025-08-01",
};

export async function getFundAnalytics(
  schemeCode: string,
  benchmarkName: string,
  range: DateRange = DEFAULT_RANGE,
): Promise<FundAnalytics> {
  const { data } = await api.get<FundAnalytics>("/analytics/fund", {
    params: {
      scheme_code: schemeCode,
      benchmark_name: benchmarkName,
      start_date: range.startDate,
      end_date: range.endDate,
    },
  });
  return data;
}

export async function compareFunds(
  schemeCodes: string[],
  benchmarkName: string,
  range: DateRange = DEFAULT_RANGE,
): Promise<CompareResponse> {
  const { data } = await api.get<CompareResponse>("/analytics/compare", {
    params: {
      scheme_codes: schemeCodes.join(","),
      benchmark_name: benchmarkName,
      start_date: range.startDate,
      end_date: range.endDate,
    },
  });
  return data;
}

export async function getDemoPortfolio(
  range: DateRange = DEFAULT_RANGE,
): Promise<PortfolioOverview> {
  const { data } = await api.get<PortfolioOverview>(
    "/analytics/portfolio/demo",
    {
      params: {
        start_date: range.startDate,
        end_date: range.endDate,
      },
    },
  );
  return data;
}

export async function searchFunds(keyword: string): Promise<FundSummary[]> {
  const { data } = await api.get<FundSummary[]>("/funds/search", {
    params: { keyword },
  });
  return data;
}
