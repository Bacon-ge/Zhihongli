'use client';

import { motion, useReducedMotion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { enterFromBelow } from '@/lib/motion';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title = 'About' }: AboutProps) {
    const shouldReduceMotion = Boolean(useReducedMotion());

    return (
        <motion.section
            {...enterFromBelow(shouldReduceMotion)}
            className="about-section"
        >
            <h2 className="section-heading mb-5">{title}</h2>
            <div className="about-copy max-w-[66ch] text-base leading-[1.85] text-neutral-700">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="section-heading mt-10 mb-5">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-semibold tracking-tight text-primary mt-10 mb-5">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold tracking-tight text-primary mt-8 mb-4">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 last:mb-0 text-pretty">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-link font-medium"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.section>
    );
}
