'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { CardPageConfig } from '@/types/page';
import { enterFromBelow, enterTransition } from '@/lib/motion';
import { withBasePath } from '@/lib/utils';

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const shouldReduceMotion = Boolean(useReducedMotion());
    const usesEditorialList = config.items.some((item) => item.logo);

    return (
        <motion.div
            {...enterFromBelow(shouldReduceMotion)}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-3xl" : "text-4xl"} font-serif font-semibold tracking-tight text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            <div className={usesEditorialList ? 'service-list' : `grid ${embedded ? "gap-4" : "gap-6"}`}>
                {config.items.map((item, index) => (
                    <motion.article
                        key={index}
                        {...enterFromBelow(shouldReduceMotion, 6)}
                        transition={{ ...enterTransition, delay: shouldReduceMotion ? 0 : Math.min(index * 0.04, 0.16) }}
                        className={usesEditorialList ? 'service-row' : `ui-card ${embedded ? "p-5" : "p-6"} rounded-xl`}
                    >
                        <div className={usesEditorialList ? 'service-row__inner' : undefined}>
                            {usesEditorialList && item.logo && (
                                <div className="service-mark">
                                    <Image
                                        src={withBasePath(item.logo)}
                                        alt={item.logo_alt || ''}
                                        width={72}
                                        height={72}
                                        className={`service-logo${item.logo_key ? ` service-logo--${item.logo_key}` : ''}`}
                                    />
                                </div>
                            )}

                            <div className="min-w-0">
                                <div className={`flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 ${usesEditorialList ? '' : 'mb-2'}`}>
                                    <h3 className={`${embedded ? "text-lg" : "text-xl"} ${usesEditorialList ? 'font-serif tracking-tight' : ''} font-semibold text-primary`}>{item.title}</h3>
                                    {item.date && (
                                        <span className={usesEditorialList ? 'shrink-0 text-sm font-medium tracking-wide text-accent' : 'text-sm text-neutral-500 font-medium bg-neutral-100 px-2 py-1 rounded'}>
                                            {item.date}
                                        </span>
                                    )}
                                </div>
                                {item.subtitle && (
                                    <p className={`${embedded ? "text-sm" : "text-base"} ${usesEditorialList ? 'mt-2 text-neutral-700' : 'mb-3 text-accent'} font-medium`}>{item.subtitle}</p>
                                )}
                                {item.content && (
                                    <p className={`${embedded ? "text-sm" : "text-base"} ${usesEditorialList ? 'mt-1' : ''} text-neutral-600 leading-relaxed`}>
                                        {item.content}
                                    </p>
                                )}
                                {item.tags && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded border border-neutral-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </motion.div>
    );
}
