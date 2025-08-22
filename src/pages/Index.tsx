import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ClassExamsSection from '@/components/ClassExamsSection';
import WinnersSection from '@/components/WinnersSection';
import BenefitsSection from '@/components/BenefitsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ClassExamsSection />
      <WinnersSection />
      <BenefitsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
