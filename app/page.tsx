import Navbar from '@/components/onboarding/Navbar';
import Hero from '@/components/onboarding/Hero';
import Resources from '@/components/onboarding/Resources';
import Brief from '@/components/onboarding/Brief';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Resources />
      <Brief />
    </>
  );
}
