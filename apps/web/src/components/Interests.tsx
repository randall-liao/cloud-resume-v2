import { resumeData } from '@cloud-resume-v2/contracts';

export default function Interests() {
  const { interests, certifications } = resumeData;
  return (
    <section aria-labelledby="interests-heading">
      <div className="flex items-center mb-8 reveal-on-scroll">
        <span className="material-icons text-primary mr-2">interests</span>
        <h2 id="interests-heading" className="text-2xl font-bold text-slate-900 dark:text-white">Interests</h2>
      </div>
      <div className="space-y-6">
        {interests.map((interest, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-lg p-6 relative overflow-hidden shadow-card m-transition hover:shadow-hover hover:-translate-y-1 group reveal-on-scroll"
            style={{ transitionDelay: `${(idx + 1 + certifications.length) * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{interest.title}</h3>
                <p className="text-primary font-medium text-sm mt-1">{interest.subtitle}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                {interest.url ? (
                  <a
                    href={interest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${interest.title}`}
                    className="flex items-center justify-center hover:text-red-600 transition-colors"
                  >
                    <span className="material-icons" aria-hidden="true">{interest.icon}</span>
                  </a>
                ) : (
                  <span className="material-icons" aria-hidden="true">{interest.icon}</span>
                )}
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
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-subtle mr-2" title="Active"></span>
                  {interest.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
