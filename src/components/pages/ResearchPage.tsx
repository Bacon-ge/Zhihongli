'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ResearchEntry, ResearchPageConfig } from '@/types/page';
import { enterFromBelow, enterTransition } from '@/lib/motion';

interface ResearchSectionProps {
    title: string;
    entries: ResearchEntry[];
    presentation?: boolean;
}

function HighlightedAuthors({ authors }: { authors: string }) {
    return (
        <>
            {authors.split(/(Li,\s*Z\.?)/g).map((part, index) =>
                /^Li,\s*Z\.?$/.test(part) ? (
                    <strong key={`${part}-${index}`} className="font-semibold text-accent-dark">
                        {part}
                    </strong>
                ) : (
                    part
                ),
            )}
        </>
    );
}

function ResearchSection({ title, entries, presentation = false }: ResearchSectionProps) {
    const shouldReduceMotion = Boolean(useReducedMotion());

    return (
        <section aria-labelledby={`research-${title.toLowerCase().replaceAll(' ', '-')}`}>
            <div className="research-section__heading">
                <h2
                    id={`research-${title.toLowerCase().replaceAll(' ', '-')}`}
                    className="font-serif text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
                >
                    {title}
                </h2>
            </div>

            <div className="research-list">
                {entries.map((entry, index) => (
                    <motion.article
                        key={`${entry.number}-${entry.title}`}
                        {...enterFromBelow(shouldReduceMotion, 6)}
                        transition={{
                            ...enterTransition,
                            delay: shouldReduceMotion ? 0 : Math.min(index * 0.04, 0.12),
                        }}
                        className="research-row"
                    >
                        <div className="research-row__inner">
                            <span className="research-index" aria-label={`Item ${entry.number}`}>
                                [{entry.number}]
                            </span>
                            <p className="min-w-0 text-[0.98rem] leading-7 text-neutral-700 sm:text-base sm:leading-8">
                                <HighlightedAuthors authors={entry.authors} /> ({entry.year}).{' '}
                                <span className="font-medium text-primary">{entry.title}.</span>{' '}
                                {presentation ? 'Presented at the ' : ''}
                                <em className="font-medium text-neutral-800">{entry.venue}</em>
                                {entry.details ? `, ${entry.details}` : ''}
                                {entry.location ? `, ${entry.location}` : ''}.
                            </p>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}

export default function ResearchPage({ config }: { config: ResearchPageConfig }) {
    const shouldReduceMotion = Boolean(useReducedMotion());

    return (
        <motion.div {...enterFromBelow(shouldReduceMotion)}>
            <header className="mb-10 sm:mb-12">
                <h1 className="font-serif text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
                    {config.title}
                </h1>
            </header>

            <div className="space-y-12 sm:space-y-16">
                <ResearchSection title="Publications" entries={config.publications} />
                <ResearchSection
                    title="Conference Presentations"
                    entries={config.conference_presentations}
                    presentation
                />
            </div>
        </motion.div>
    );
}
