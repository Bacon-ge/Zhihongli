import { ArrowDownTrayIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { PdfPageConfig } from '@/types/page';
import { withBasePath } from '@/lib/utils';

interface PdfPageProps {
    config: PdfPageConfig;
    embedded?: boolean;
}

export default function PdfPage({ config, embedded = false }: PdfPageProps) {
    const pdfUrl = withBasePath(config.source);
    const viewerUrl = `${pdfUrl}#view=FitH&toolbar=1&navpanes=0`;

    return (
        <section aria-labelledby="cv-heading">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1
                        id="cv-heading"
                        className={`${embedded ? 'text-3xl' : 'text-4xl'} font-serif font-semibold tracking-tight text-primary`}
                    >
                        {config.title}
                    </h1>
                    {config.description && (
                        <p className="mt-2 max-w-2xl text-base leading-7 text-neutral-600">
                            {config.description}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ui-pressable inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                    >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
                        Open PDF
                    </a>
                    <a
                        href={pdfUrl}
                        download="Zhihong-Li-CV.pdf"
                        className="ui-pressable inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white hover:bg-accent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
                        Download
                    </a>
                </div>
            </div>

            <div
                className="h-[70vh] min-h-[34rem] max-h-[52rem] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-neutral-100 p-2 shadow-[var(--shadow-soft)] sm:h-[74vh] sm:p-3"
                aria-label="Embedded PDF viewer for Zhihong Li's curriculum vitae"
            >
                <iframe
                    src={viewerUrl}
                    title="Zhihong Li curriculum vitae PDF"
                    className="block h-full w-full rounded-xl bg-white"
                    loading="lazy"
                />
            </div>

            <div className="mt-4 pr-24 text-sm leading-6 text-neutral-500 sm:pr-0">
                {config.updated && (
                    <p className="font-medium text-neutral-600">Updated on {config.updated}</p>
                )}
            </div>
        </section>
    );
}
