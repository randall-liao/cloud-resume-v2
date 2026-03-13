import { resumeData } from '@cloud-resume-v2/contracts';

export default function OriginStory() {
  const { originStory } = resumeData;
  return (
    <section className="relative">
      <div className="bg-white dark:bg-surface-dark rounded-lg p-1 border-l-4 border-primary shadow-sm transition-colors">
        <div className="p-6 md:p-8 bg-gray-50 dark:bg-[#161b22] rounded-r-lg transition-colors">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full text-primary">
              <span className="material-icons text-3xl">{originStory.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 font-display">{originStory.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed font-serif">
                {originStory.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
