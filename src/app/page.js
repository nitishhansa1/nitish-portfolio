'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import ScrollProgress from '@/components/ScrollProgress';
import CursorGlow from '@/components/CursorGlow';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import GlassmorphismBG from '@/components/GlassmorphismBG';
import SectionDivider from '@/components/SectionDivider';
import PageLoadCurtain from '@/components/PageLoadCurtain';
import PerspectiveGrid from '@/components/PerspectiveGrid';
import Floating3DShapes from '@/components/Floating3DShapes';

export default function Home() {
  return (
    <ThemeProvider>
      <PageLoadCurtain />
      <ScrollProgress />
      <CursorGlow />
      <PerspectiveGrid />
      <Floating3DShapes />
      <Navbar />
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <GlassmorphismBG />
        <main style={{ position: 'relative', zIndex: 1 }}>
          <Hero />
          <SectionDivider variant="wave" />
          <About />
          <SectionDivider variant="dots" />
          <Experience />
          <SectionDivider variant="gradient" />
          <Projects />
          <Skills />
          <SectionDivider variant="wave" flip />
          <Testimonials />
          <SectionDivider variant="gradient" />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
