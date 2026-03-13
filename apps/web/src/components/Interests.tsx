import { resumeData } from '@cloud-resume-v2/contracts';

export default function Interests() {
  const { interests } = resumeData;
  return (
    <>
      {interests.map((interest, idx) => (
        <div key={idx} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-lg p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{interest.title}</h3>
              <p className="text-primary font-medium text-sm mt-1">{interest.subtitle}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
              <span className="material-icons">{interest.icon}</span>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
            {interest.description}
          </p>
          <div className="bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded p-3 font-mono text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
            {interest.metrics.map((metric, i) => (
              <div key={i} className={`flex flex-col ${i > 0 ? 'text-right' : ''}`}>
                 <span className="uppercase text-[10px] text-slate-400 mb-1">{metric.label}</span>
                 <span className="text-slate-900 dark:text-white font-bold text-base">{metric.value}</span>
              </div>
            ))}
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <div className="flex items-center text-green-600 dark:text-green-500 font-bold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" title="Active"></span>
                {interest.status}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
