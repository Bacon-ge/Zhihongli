'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    BookOpenIcon,
    ClipboardDocumentIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn, withBasePath } from '@/lib/utils';
import { disclosureMotion, EASE_OUT, enterFromBelow } from '@/lib/motion';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    const shouldReduceMotion = Boolean(useReducedMotion());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedType, setSelectedType] = useState<string | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
    const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);

    // Extract unique years and types for filters
    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(publications.map(p => p.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [publications]);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(publications.map(p => p.type)));
        return uniqueTypes.sort();
    }, [publications]);

    // Filter publications
    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            const matchesSearch =
                pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.authors.some(author => author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.conference?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
            const matchesType = selectedType === 'all' || pub.type === selectedType;

            return matchesSearch && matchesYear && matchesType;
        });
    }, [publications, searchQuery, selectedYear, selectedType]);

    return (
        <motion.div
            {...enterFromBelow(shouldReduceMotion)}
        >
            <div className="mb-8">
                <h1 className={`${embedded ? "text-3xl" : "text-4xl"} font-serif font-semibold tracking-tight text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-8 space-y-4">
                {/* ... (keep existing controls) ... */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                            type="text"
                            aria-label="Search publications"
                            placeholder="Search publications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-primary placeholder:text-neutral-400 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:ring-2 focus:ring-accent/30 focus:border-accent"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        aria-expanded={showFilters}
                        aria-controls="publication-filters"
                        className={cn(
                            "ui-pressable flex items-center justify-center px-4 py-2.5 rounded-xl border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                            showFilters
                                ? "bg-accent text-white border-accent"
                                : "bg-white border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent"
                        )}
                    >
                        <FunnelIcon className="h-5 w-5 mr-2" />
                        Filters
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            id="publication-filters"
                            {...disclosureMotion(shouldReduceMotion)}
                            transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, ease: EASE_OUT }}
                            className="origin-top"
                        >
                            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 flex flex-wrap gap-6">
                                {/* Year Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-1" /> Year
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedYear('all')}
                                            className={cn(
                                                "ui-pressable px-3 py-1.5 text-xs rounded-full",
                                                selectedYear === 'all'
                                                    ? "bg-accent text-white"
                                                    : "bg-white text-neutral-600 hover:bg-neutral-100"
                                            )}
                                            aria-pressed={selectedYear === 'all'}
                                        >
                                            All
                                        </button>
                                        {years.map(year => (
                                            <button
                                                key={year}
                                                onClick={() => setSelectedYear(year)}
                                                className={cn(
                                                    "ui-pressable px-3 py-1.5 text-xs rounded-full",
                                                    selectedYear === year
                                                        ? "bg-accent text-white"
                                                        : "bg-white text-neutral-600 hover:bg-neutral-100"
                                                )}
                                                aria-pressed={selectedYear === year}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Type Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 flex items-center">
                                        <BookOpenIcon className="h-4 w-4 mr-1" /> Type
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedType('all')}
                                            className={cn(
                                                "ui-pressable px-3 py-1.5 text-xs rounded-full",
                                                selectedType === 'all'
                                                    ? "bg-accent text-white"
                                                    : "bg-white text-neutral-600 hover:bg-neutral-100"
                                            )}
                                            aria-pressed={selectedType === 'all'}
                                        >
                                            All
                                        </button>
                                        {types.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={cn(
                                                    "ui-pressable px-3 py-1.5 text-xs rounded-full capitalize",
                                                    selectedType === type
                                                        ? "bg-accent text-white"
                                                        : "bg-white text-neutral-600 hover:bg-neutral-100"
                                                )}
                                                aria-pressed={selectedType === type}
                                            >
                                                {type.replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Publications Grid */}
            <div className="space-y-6">
                {filteredPublications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                        No publications found matching your criteria.
                    </div>
                ) : (
                    filteredPublications.map((pub) => (
                        <article
                            key={pub.id}
                            className="ui-card p-5 sm:p-6 rounded-2xl"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {pub.preview && (
                                    <div className="w-full md:w-48 flex-shrink-0">
                                        <div className="aspect-video md:aspect-[4/3] relative rounded-lg overflow-hidden bg-neutral-100">
                                            <Image
                                                src={withBasePath(`/papers/${pub.preview}`)}
                                                alt={pub.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary mb-2 leading-tight`}>
                                        {pub.title}
                                    </h3>
                                    <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 mb-2`}>
                                        {pub.authors.map((author, idx) => (
                                            <span key={idx}>
                                                <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
                                                    {author.name}
                                                </span>
                                                {author.isCorresponding && (
                                                    <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600'}`}>†</sup>
                                                )}
                                                {idx < pub.authors.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </p>
                                    <p className="text-sm font-medium text-neutral-800 mb-3">
                                        {pub.journal || pub.conference} {pub.year}
                                    </p>

                                    {pub.description && (
                                        <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                                            {pub.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {pub.doi && (
                                            <a
                                                href={`https://doi.org/${pub.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ui-pressable inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-accent hover:text-white"
                                            >
                                                DOI
                                            </a>
                                        )}
                                        {pub.code && (
                                            <a
                                                href={pub.code}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ui-pressable inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-accent hover:text-white"
                                            >
                                                Code
                                            </a>
                                        )}
                                        {pub.abstract && (
                                            <button
                                                onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                                aria-expanded={expandedAbstractId === pub.id}
                                                aria-controls={`abstract-${pub.id}`}
                                                className={cn(
                                                    "ui-pressable inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium",
                                                    expandedAbstractId === pub.id
                                                        ? "bg-accent text-white"
                                                        : "bg-neutral-100 text-neutral-700 hover:bg-accent hover:text-white"
                                                )}
                                            >
                                                <DocumentTextIcon className="h-3 w-3 mr-1.5" />
                                                Abstract
                                            </button>
                                        )}
                                        {pub.bibtex && (
                                            <button
                                                onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                                aria-expanded={expandedBibtexId === pub.id}
                                                aria-controls={`bibtex-${pub.id}`}
                                                className={cn(
                                                    "ui-pressable inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium",
                                                    expandedBibtexId === pub.id
                                                        ? "bg-accent text-white"
                                                        : "bg-neutral-100 text-neutral-700 hover:bg-accent hover:text-white"
                                                )}
                                            >
                                                <BookOpenIcon className="h-3 w-3 mr-1.5" />
                                                BibTeX
                                            </button>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {expandedAbstractId === pub.id && pub.abstract ? (
                                            <motion.div
                                                key="abstract"
                                                id={`abstract-${pub.id}`}
                                                {...disclosureMotion(shouldReduceMotion)}
                                                transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease: EASE_OUT }}
                                                className="origin-top mt-4"
                                            >
                                                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                                                    <p className="text-sm text-neutral-600 leading-relaxed">
                                                        {pub.abstract}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ) : null}
                                        {expandedBibtexId === pub.id && pub.bibtex ? (
                                            <motion.div
                                                key="bibtex"
                                                id={`bibtex-${pub.id}`}
                                                {...disclosureMotion(shouldReduceMotion)}
                                                transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease: EASE_OUT }}
                                                className="origin-top mt-4"
                                            >
                                                <div className="relative bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                                                    <pre className="text-xs text-neutral-600 overflow-x-auto whitespace-pre-wrap font-mono">
                                                        {pub.bibtex}
                                                    </pre>
                                                    <button
                                                        onClick={async () => {
                                                            await navigator.clipboard.writeText(pub.bibtex || '');
                                                            setCopiedBibtexId(pub.id);
                                                            window.setTimeout(() => setCopiedBibtexId(null), 1800);
                                                        }}
                                                        className="ui-pressable absolute top-2 right-2 inline-flex items-center gap-1.5 p-1.5 rounded-md bg-white text-neutral-500 hover:text-accent shadow-sm border border-neutral-200"
                                                        title={copiedBibtexId === pub.id ? 'Copied' : 'Copy to clipboard'}
                                                        aria-label={copiedBibtexId === pub.id ? 'BibTeX copied' : 'Copy BibTeX to clipboard'}
                                                    >
                                                        <ClipboardDocumentIcon className="h-4 w-4" />
                                                        {copiedBibtexId === pub.id && <span className="text-[11px] font-medium" aria-live="polite">Copied</span>}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </motion.div>
    );
}
