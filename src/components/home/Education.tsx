import Image from 'next/image';
import { withBasePath } from '@/lib/utils';

export interface EducationItem {
    institution: string;
    period: string;
    degree: string;
    details?: string;
    logo: string;
    logo_alt: string;
    logo_key: 'oxford' | 'zhejiang' | 'uchicago';
}

interface EducationProps {
    title?: string;
    items: EducationItem[];
}

export default function Education({ title = 'Education', items }: EducationProps) {
    return (
        <section aria-labelledby="education-heading">
            <h2 id="education-heading" className="section-heading mb-5">
                {title}
            </h2>

            <div className="education-list">
                {items.map((item) => (
                    <article
                        key={`${item.institution}-${item.period}`}
                        className="education-row"
                    >
                        <div className="education-row__inner">
                            <div className="education-mark">
                                <Image
                                    src={withBasePath(item.logo)}
                                    alt={item.logo_alt}
                                    width={64}
                                    height={64}
                                    className={`education-logo education-logo--${item.logo_key}`}
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                                    <h3 className="font-serif text-xl font-semibold leading-tight tracking-tight text-primary">
                                        {item.institution}
                                    </h3>
                                    <time className="shrink-0 text-sm font-medium tracking-wide text-accent">
                                        {item.period}
                                    </time>
                                </div>
                                <p className="mt-2 text-[1.02rem] font-medium leading-7 text-neutral-700">
                                    {item.degree}
                                </p>
                                {item.details && (
                                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                                        {item.details}
                                    </p>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
