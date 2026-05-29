import { resumeData } from '@cloud-resume-v2/contracts';

export default function SideProjects() {
  const { sideProjects } = resumeData;

  if (!sideProjects || sideProjects.length === 0) return null;

  return (
    <section>
      <div className="flex items-center mb-8 reveal-on-scroll">
        <span className="material-icons text-slate-400 dark:text-slate-500 mr-3 text-3xl">dashboard</span>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Side Projects</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sideProjects.map((project, idx) => (
          <div 
            key={project.title} 
            className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-200 dark:border-white/5 p-8 shadow-md3 m-transition hover:shadow-hover hover:-translate-y-1 flex flex-col justify-between group reveal-on-scroll"
            style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center shadow-sm">
                  <span className="material-icons text-slate-600 dark:text-slate-400 text-2xl">{project.icon}</span>
                </div>
                <a className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors" href={project.url} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github text-xl"></i>
                </a>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{project.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                {project.description}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-black/20 rounded-xl p-4 border border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-4 gap-2 mb-2">
                    {project.metrics?.map((metric) => (
                         <div key={metric.label} className="h-8 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded flex items-center justify-center text-[10px] font-mono text-slate-500 dark:text-slate-400 shadow-sm">{metric.label}</div>
                    ))}
                </div>
                {project.uptime && (
                  <>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mt-4">
                      <div className="h-full bg-primary" style={{ width: `${project.statusPercentage || 100}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">{project.statusLabel || 'Uptime'}</span>
                      <span className="text-[10px] text-slate-700 dark:text-slate-300 font-mono font-bold">{project.uptime}</span>
                    </div>
                  </>
                )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
