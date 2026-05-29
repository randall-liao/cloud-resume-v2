import { resumeData } from '@cloud-resume-v2/contracts';

export default function OriginStory() {
  const { originStory } = resumeData;
  return (
    <section className="relative reveal-on-scroll" aria-labelledby="origin-story-heading">
      <div className="bg-white dark:bg-surface-dark rounded-lg p-1 border-l-4 border-primary shadow-soft m-transition hover:shadow-hover hover:-translate-y-1">
        <div className="p-6 md:p-8 bg-gray-50 dark:bg-[#161b22] rounded-r-lg transition-colors">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full text-primary">
              <span className="material-icons text-3xl">{originStory.icon}</span>
            </div>
            <div>
              <h2 id="origin-story-heading" className="text-lg font-semibold text-slate-900 dark:text-white mb-2 font-display">{originStory.title}</h2>
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
