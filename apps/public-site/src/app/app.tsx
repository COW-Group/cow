import { Route, Routes } from 'react-router-dom';
import Home from '../pages/index';
import SignIn from '../pages/sign-in';
import InvestorPortal from '../pages/investor-portal';
import InvestorDashboard from '../pages/investor/dashboard';
import InvestorPortfolio from '../pages/investor/portfolio';
import InvestmentOpportunities from '../pages/investor/opportunities';
import InvestorTransactions from '../pages/investor/transactions';
import InvestorProfile from '../pages/investor/profile';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/investor-portal" element={<InvestorPortal />} />
      <Route path="/investor/dashboard" element={<InvestorDashboard />} />
      <Route path="/investor/portfolio" element={<InvestorPortfolio />} />
      <Route path="/investor/opportunities" element={<InvestmentOpportunities />} />
      <Route path="/investor/transactions" element={<InvestorTransactions />} />
      <Route path="/investor/profile" element={<InvestorProfile />} />
    </Routes>
  );
}

export default App;
