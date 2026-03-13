import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import OriginStory from './components/OriginStory';
import CommitHistory from './components/CommitHistory';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Interests from './components/Interests'; // Renamed from PrecisionCooking block
import Footer from './components/Footer';
import resumeData from './data/resume.json';

import { themeManager } from './utils/themeManager';

function App() {
  // 🎓 LEARNING NOTE (State & Side Effects):
  // 1. `darkMode` is local STATE initialized from our OOP ThemeManager.
  // 2. `setDarkMode` is the mutation function.
  const [darkMode, setDarkMode] = useState<boolean>(() => themeManager.getInitialTheme());

  // 🎓 LEARNING NOTE (Hooks):
  // `useEffect` allows you to sync your React state with external systems. 
  // In this case, whenever the "Database" (darkMode) changes, we trigger a "Side-Effect" 
  // to update the external browser DOM class list and persist the state.
  useEffect(() => {
    // Dynamic document title from our resume.json
    document.title = `${resumeData.header.name} | Cloud Architect Dashboard`;
    
    // Save state via OOP manager
    themeManager.saveTheme(darkMode);

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 antialiased min-h-screen pb-20 relative font-display">
      <div className="fixed top-20 right-0 -z-10 opacity-20 pointer-events-none overflow-hidden h-96 w-96">
        <img alt="Abstract Pattern" className="w-full h-full object-cover blur-3xl rounded-full" src="/assets/background.png" />
      </div>

      {/* 🎓 LEARNING NOTE (Component Composition/Microservices):
      // Notice how App.tsx acts as an API Gateway. It doesn't render the UI logic itself.
      // It composes other independent modules (Header, Hero, etc.) to build the full page.
      // This is the core strength of React's Component Architecture. */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-12">
        <Hero />
        <OriginStory />
        <CommitHistory />
        <Education />
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Certifications />
            <Interests />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
