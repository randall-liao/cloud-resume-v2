import { resumeData } from '@cloud-resume-v2/contracts';

// 🎓 LEARNING NOTE (Backend Analogy):
// Props (HeaderProps) are like function arguments passed down from a parent service. 
// "darkMode" is the current state (like reading from a DB/Cache), and "setDarkMode" 
// is the mutation function (like an UPDATE query) to change that state in the parent.
interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const { header } = resumeData;
  return (
    <header className="fixed top-0 w-full z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-surface-border transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-primary font-mono font-bold text-xl">&lt;{header.name} <span>/</span>&gt;</span>
        </div>
        <div className="flex items-center space-x-4">
          {header.socialLinks.map((link, idx) => (
            <a key={idx} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-primary/20 transition-colors text-slate-600 dark:text-slate-300" href={link.url}>
              <i className={`${link.icon} text-xl`}></i>
            </a>
          ))}
          <button 
            aria-label="Toggle theme" 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-primary/20 transition-colors text-slate-600 dark:text-yellow-400 group relative"
          >
            <span className="material-symbols-outlined text-[24px]">{darkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
