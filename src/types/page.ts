export interface BasePageConfig {
    type: 'about' | 'publication' | 'research' | 'card' | 'text' | 'pdf';
    title: string;
    description?: string;
}

export interface ResearchEntry {
    number: number;
    authors: string;
    year: number;
    title: string;
    venue: string;
    details?: string;
    location?: string;
}

export interface ResearchPageConfig extends BasePageConfig {
    type: 'research';
    publications: ResearchEntry[];
    conference_presentations: ResearchEntry[];
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface PdfPageConfig extends BasePageConfig {
    type: 'pdf';
    source: string;
    updated?: string;
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
    logo?: string;
    logo_alt?: string;
    logo_key?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}
