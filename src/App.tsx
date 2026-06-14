import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import FundAnalysis from "./pages/FundAnalysis";
import FundComparison from "./pages/FundComparison";
import PortfolioOverview from "./pages/PortfolioOverview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<PortfolioOverview />} />
          <Route path="fund-analysis" element={<FundAnalysis />} />
          <Route path="fund-comparison" element={<FundComparison />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
