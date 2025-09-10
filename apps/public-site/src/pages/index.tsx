import { Layout } from '@/components/layout/Layout';
import HeroSection from '@/components/marketing/HeroSection';
import InvestmentOpportunities from '@/components/marketing/InvestmentOpportunities';
import CompanyShowcase from '@/components/marketing/CompanyShowcase';
import InvestorTestimonials from '@/components/marketing/InvestorTestimonials';
import ComplianceInfo from '@/components/marketing/ComplianceInfo';
import InvestorPortalCTA from '@/components/marketing/InvestorPortalCTA';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <InvestmentOpportunities />
      <CompanyShowcase />
      <InvestorTestimonials />
      <ComplianceInfo />
      <InvestorPortalCTA />
    </Layout>
  );
}