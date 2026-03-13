import { useState, useEffect } from 'react';
import { resumeData } from '@cloud-resume-v2/contracts';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(true);
  const { footer } = resumeData;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      const isAtBottom = Math.ceil(scrollY + innerHeight) >= scrollHeight - 10;
      const isAtTop = scrollY <= 10;

      setIsVisible(isAtTop || isAtBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className={`fixed bottom-0 w-full z-40 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-surface-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-6">
          <div className="flex items-center px-2 py-0.5 rounded bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
            <span className="hidden sm:inline font-semibold text-green-700 dark:text-green-500">System: </span>
            <span className="text-green-700 dark:text-green-500 ml-1 font-bold">{footer.systemStatus}</span>
          </div>
          <div className="hidden sm:flex items-center">
            <span className="material-icons text-[14px] mr-1 text-slate-400 dark:text-primary">dns</span>
            <span className="text-slate-600 dark:text-slate-400">{footer.region}</span>
          </div>
          <div className="flex items-center group cursor-pointer relative hover:bg-slate-50 dark:hover:bg-white/5 px-2 py-1 rounded transition-colors">
            <span className="material-icons text-[14px] mr-1 text-orange-500 dark:text-orange-400">visibility</span>
            <span className="text-slate-600 dark:text-slate-400">Visitors: <span className="text-slate-900 dark:text-white font-bold">843</span></span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-slate-800 dark:bg-black text-white text-center rounded py-1 px-2 text-[10px] hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              DynamoDB Live Count
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-2 hidden sm:inline text-slate-400">Latency:</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{footer.latency}</span>
          <div className="ml-4 pl-4 border-l border-slate-200 dark:border-slate-700 hidden sm:block text-slate-400">
            Built with <i className="fab fa-react mx-1 text-blue-500"></i> &amp; Tailwind
          </div>
        </div>
      </div>
    </footer>
  );
}
