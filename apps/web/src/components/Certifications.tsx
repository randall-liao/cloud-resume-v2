import { resumeData } from '@cloud-resume-v2/contracts';

export default function Certifications() {
  const { certifications } = resumeData;
  return (
    <section aria-labelledby="certifications-heading">
      <div className="flex items-center mb-8 reveal-on-scroll">
        <span className="material-icons text-primary mr-2">badge</span>
        <h2 id="certifications-heading" className="text-2xl font-bold text-slate-900 dark:text-white">Certifications</h2>
      </div>
      <div className="space-y-6">
        {certifications.map((cert, idx) => (
          <div 
            key={cert.validationId} 
            className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-lg p-1 relative isolate overflow-hidden group shadow-card m-transition hover:shadow-hover hover:-translate-y-1 reveal-on-scroll"
            style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
          >
            <div 
              className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full pointer-events-none"
              style={{ background: `linear-gradient(to bottom right, ${cert.color}, transparent)` }}
            ></div>
            <div className="p-6 h-full flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#232F3E] rounded p-2 shadow-sm">
                    <i className={`${cert.icon} text-3xl`} style={{ color: cert.color }} aria-hidden="true"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cert.name}</h3>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-2 font-medium">{cert.subtitle}</p>
                <p className="text-xs text-slate-500 font-mono">Validation ID: {cert.validationId}</p>
              </div>
              <div className="mt-6">
                <a className="relative z-30 text-sm font-medium hover:text-[#ffac31] flex items-center uppercase tracking-wider" style={{ color: cert.color }} href={cert.url} target="_blank" rel="noopener noreferrer">
                  Verify Badge <span className="material-icons text-sm ml-1" aria-hidden="true">open_in_new</span>
                </a>
              </div>
            </div>

            <a
              className="absolute inset-0 z-20 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open the ${cert.name} certification`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
