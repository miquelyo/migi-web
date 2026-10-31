import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import {
  Features, Mascot, Tech, Customize, Download, Support, FeedbackNote, Faq, Privacy, Footer,
} from '@/components/Sections';

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Mascot />
      <Tech />
      <Customize />
      <Download />
      <Support />
      <FeedbackNote />
      <Faq />
      <Privacy />
      <Footer />
    </main>
  );
}
