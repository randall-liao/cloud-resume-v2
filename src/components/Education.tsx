import resumeData from '../data/resume.json';

export default function Education() {
  const { education } = resumeData;
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-gray-100 flex items-center">
        <span className="material-icons mr-3 text-[#10B981]">school</span> Education
      </h2>
      <div className="space-y-6">
        {education.map((edu, idx) => (
          <div key={idx} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-lg p-6 relative overflow-hidden transition-all hover:shadow-md">
            <div 
              className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full pointer-events-none"
              style={{ background: `linear-gradient(to bottom right, ${edu.color}, transparent)` }}
            ></div>
            <div className="relative z-10 flex items-start space-x-4">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gray-50 dark:bg-[#1E293B] rounded shadow-sm">
                <span className="material-icons text-2xl" style={{ color: edu.color }}>{edu.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1">
                    {edu.institution}
                  </h3>
                  <span className="inline-block mt-2 md:mt-0 text-sm font-semibold text-slate-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full whitespace-nowrap">
                    {edu.graduationDate}
                  </span>
                </div>
                <p className="font-medium text-slate-600 dark:text-slate-300 mt-2">
                  {edu.degree}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
