import { resumeData } from '@cloud-resume-v2/contracts';

export default function CommitHistory() {
  const { experience } = resumeData;
  return (
    <section>
      <div className="flex items-center mb-8">
        <span className="material-icons text-primary mr-2">history</span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Commit History</h2>
      </div>
      <div className="relative pl-12 space-y-8">
        <div className="git-line"></div>
        
        {experience.map((job, index) => (
          <div key={index} className="relative group">
            <div className="git-node bg-white dark:bg-background-dark group-hover:bg-primary transition-colors"></div>
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-lg p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{job.company}</h3>
                  <p className="text-primary font-medium">{job.role}</p>
                </div>
                <span className="mt-2 md:mt-0 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded text-sm font-mono text-slate-500">
                  {job.period}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {job.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {job.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-xs font-mono text-slate-600 dark:text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
