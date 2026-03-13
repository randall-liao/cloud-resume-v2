import { resumeData } from '@cloud-resume-v2/contracts';

export default function Certifications() {
  const { certifications } = resumeData;
  return (
    <>
      {certifications.map((cert, idx) => (
        <div key={idx} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-lg p-1 relative overflow-hidden group transition-all hover:shadow-md">
          <div 
            className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full pointer-events-none"
            style={{ background: `linear-gradient(to bottom right, ${cert.color}, transparent)` }}
          ></div>
          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#232F3E] rounded p-2 shadow-sm">
                  <i className={`${cert.icon} text-3xl`} style={{ color: cert.color }}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cert.name}</h3>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-2 font-medium">{cert.subtitle}</p>
              <p className="text-xs text-slate-500 font-mono">Validation ID: {cert.validationId}</p>
            </div>
            <div className="mt-6">
              <a className="text-sm font-medium hover:text-[#ffac31] flex items-center uppercase tracking-wider" style={{ color: cert.color }} href={cert.url}>
                Verify Badge <span className="material-icons text-sm ml-1">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
