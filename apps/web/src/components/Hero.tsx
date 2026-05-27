import { resumeData } from '@cloud-resume-v2/contracts';

export default function Hero() {
  // 🎓 LEARNING NOTE (Architecture):
  // Here we are separating "Content" (Data) from "Presentation" (UI Component). 
  // It's similar to the MVC pattern where this Component acts as the View, 
  // and resumeData acts as the Model. This is why we don't hardcode text!
  const { hero } = resumeData;
  const { code } = hero.ideSnippet;
  const totalLines = 11 + code.stack.length;
  const lineNumbers = Array.from({ length: totalLines }, (_, i) => i + 1);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="order-2 md:order-1 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            {hero.status}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white leading-tight">
            {hero.headlinePrefix} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">{hero.headlineHighlight}</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg">
            {hero.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <a href={hero.primaryButton.url} className="px-6 py-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border hover:border-primary text-slate-900 dark:text-white rounded-lg font-medium transition-all shadow-sm flex items-center group inline-block">
            {hero.primaryButton.text} 
            <span className="material-icons ml-2 group-hover:translate-x-1 transition-transform text-primary">arrow_forward</span>
          </a>
          <a href={hero.secondaryButton.url} className="px-6 py-3 bg-transparent text-slate-600 dark:text-slate-400 hover:text-primary font-medium transition-colors font-mono inline-block">
            {hero.secondaryButton.text}
          </a>
        </div>
      </div>

      <div className="order-1 md:order-2">
        <div className="rounded-xl overflow-hidden shadow-xl dark:shadow-2xl bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-surface-border transition-colors flex flex-col">
          {/* Top Bar */}
          <div className="bg-gray-100 dark:bg-[#252526] h-10 flex items-center border-b border-gray-200 dark:border-[#1e1e1e] transition-colors pl-4 pt-2">
            {/* Mac Window Controls */}
            <div className="flex space-x-2 mr-4 self-center pb-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>

            {/* VSCode Tab */}
            <div className="flex-1 flex h-full items-end">
              <div className="bg-white dark:bg-[#1e1e1e] h-[85%] px-4 rounded-t-lg flex items-center space-x-2 text-xs font-mono text-slate-700 dark:text-slate-300 border border-b-0 border-gray-200 dark:border-[#1e1e1e] transition-colors mr-2 relative group min-w-[140px] justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[#3b82f6] dark:text-[#569cd6] font-bold">&#123;&#125;</span>
                  <span>{hero.ideSnippet.filename}</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-icons text-[14px]">close</span>
                </button>
              </div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto transition-colors flex-grow">
            <div className="text-slate-600 dark:text-slate-400 select-none grid grid-cols-[2rem_1fr] gap-2">
              <div className="text-right text-slate-400 dark:text-slate-600 pr-2 flex flex-col transition-colors opacity-70">
                {lineNumbers.map((num) => (
                  <span key={num}>{num}</span>
                ))}
              </div>
              <div className="pl-2">
                <span className="text-[#c678dd] dark:text-[#c586c0]">const</span> <span className="text-slate-900 dark:text-[#9cdcfe]">engineer</span> <span className="text-[#56b6c2] dark:text-[#d4d4d4]">=</span> &#123;<br />
                &nbsp;&nbsp;<span className="text-[#e06c75] dark:text-[#9cdcfe]">name</span><span className="text-slate-700 dark:text-slate-300">:</span> <span className="text-[#98c379] dark:text-[#ce9178]">"{code.name}"</span><span className="text-slate-700 dark:text-slate-300">,</span><br />
                &nbsp;&nbsp;<span className="text-[#e06c75] dark:text-[#9cdcfe]">role</span><span className="text-slate-700 dark:text-slate-300">:</span> <span className="text-[#98c379] dark:text-[#ce9178]">"{code.role}"</span><span className="text-slate-700 dark:text-slate-300">,</span><br />
                &nbsp;&nbsp;<span className="text-[#e06c75] dark:text-[#9cdcfe]">location</span><span className="text-slate-700 dark:text-slate-300">:</span> <span className="text-[#98c379] dark:text-[#ce9178]">"{code.location}"</span><span className="text-slate-700 dark:text-slate-300">,</span><br />
                &nbsp;&nbsp;<span className="text-[#e06c75] dark:text-[#9cdcfe]">stack</span><span className="text-slate-700 dark:text-slate-300">:</span> [<br />
                {code.stack.map((item, i) => (
                  <span key={i}>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#98c379] dark:text-[#ce9178]">"{item}"</span>
                    {i !== code.stack.length - 1 ? <span className="text-slate-700 dark:text-slate-300">,</span> : ''}
                    <br />
                  </span>
                ))}
                &nbsp;&nbsp;]<span className="text-slate-700 dark:text-slate-300">,</span><br />
                &nbsp;&nbsp;<span className="text-[#e06c75] dark:text-[#9cdcfe]">status</span><span className="text-slate-700 dark:text-slate-300">:</span> <span className="text-[#98c379] dark:text-[#ce9178]">"{code.status}"</span><span className="text-slate-700 dark:text-slate-300">,</span><br />
                &nbsp;&nbsp;<span className="text-[#e06c75] dark:text-[#dcdcaa]">execute</span><span className="text-slate-700 dark:text-slate-300">:</span> <span className="text-[#c678dd] dark:text-[#c586c0]">async function</span>() &#123;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c678dd] dark:text-[#c586c0]">return</span> <span className="text-[#98c379] dark:text-[#ce9178]">"High Impact"</span>;<br />
                &nbsp;&nbsp;&#125;<br />
                &#125;<span className="text-slate-700 dark:text-slate-300">;</span><span className="blinking-cursor"></span>
              </div>
            </div>
          </div>

          {/* VSCode Status Bar */}
          <div className="bg-[#007acc] dark:bg-[#007acc] text-white h-6 flex items-center justify-between px-3 text-[11px] font-sans">
            <div className="flex items-center space-x-3 h-full">
              <div className="flex items-center space-x-1 hover:bg-white/20 px-1 rounded cursor-pointer h-full transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M2.5 13.5l11-5v-1l-11-5v1.4l9.5 4.1-9.5 4.1v1.4zM2 13.5V2l12 5.5-12 6z"/>
                </svg>
                <span>main*</span>
              </div>
              <div className="flex items-center space-x-1 hover:bg-white/20 px-1 rounded cursor-pointer h-full transition-colors">
                <span className="material-icons text-[12px]">sync</span>
                <span>0↓ 1↑</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 h-full">
              <div className="flex items-center hover:bg-white/20 px-1 rounded cursor-pointer h-full transition-colors hidden sm:flex">
                Ln {totalLines + 3}, Col 2
              </div>
              <div className="flex items-center hover:bg-white/20 px-1 rounded cursor-pointer h-full transition-colors">
                UTF-8
              </div>
              <div className="flex items-center hover:bg-white/20 px-1 rounded cursor-pointer h-full transition-colors">
                JSON
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
