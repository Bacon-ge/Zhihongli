import { getConfig } from '@/lib/config';
import { getMarkdownContent, getBibtexContent, getTomlContent, getPageConfig } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import Education, { EducationItem } from '@/components/home/Education';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import PdfPage from '@/components/pages/PdfPage';

import { Publication } from '@/types/publication';
import { BasePageConfig, PublicationPageConfig, TextPageConfig, CardPageConfig, PdfPageConfig } from '@/types/page';

// Define types for section config
interface SectionConfig {
  id: string;
  type: 'markdown' | 'education';
  title?: string;
  source?: string;
  content?: string;
  education?: EducationItem[];
}

type PageData =
  | { type: 'about', id: string, sections: SectionConfig[] }
  | { type: 'publication', id: string, config: PublicationPageConfig, publications: Publication[] }
  | { type: 'text', id: string, config: TextPageConfig, content: string }
  | { type: 'card', id: string, config: CardPageConfig }
  | { type: 'pdf', id: string, config: PdfPageConfig };

export default function Home() {
  const config = getConfig();
  const enableOnePageMode = config.features.enable_one_page_mode;

  // Always load about page config for profile info
  const aboutConfig = getPageConfig('about');
  const researchInterests = (aboutConfig as { profile?: { research_interests?: string[] } })?.profile?.research_interests;

  // Helper function to process sections (for about page)
  const processSections = (sections: SectionConfig[]) => {
    return sections.map((section: SectionConfig) => {
      switch (section.type) {
        case 'markdown':
          return {
            ...section,
            content: section.source ? getMarkdownContent(section.source) : ''
          };
        case 'education': {
          const educationData = section.source ? getTomlContent<{ education: EducationItem[] }>(section.source) : null;
          return {
            ...section,
            education: educationData?.education || []
          };
        }
        default:
          return section;
      }
    });
  };

  // Determine which pages to show
  let pagesToShow: PageData[] = [];

  if (enableOnePageMode) {
    pagesToShow = config.navigation
      .filter(item => item.type === 'page')
      .map(item => {
        const rawConfig = getPageConfig(item.target);
        if (!rawConfig) return null;

        const pageConfig = rawConfig as BasePageConfig;

        if (pageConfig.type === 'about' || 'sections' in (rawConfig as object)) {
          return {
            type: 'about',
            id: item.target,
            sections: processSections((rawConfig as { sections: SectionConfig[] }).sections || [])
          } as PageData;
        } else if (pageConfig.type === 'publication') {
          const pubConfig = pageConfig as PublicationPageConfig;
          const bibtex = getBibtexContent(pubConfig.source);
          return {
            type: 'publication',
            id: item.target,
            config: pubConfig,
            publications: parseBibTeX(bibtex)
          } as PageData;
        } else if (pageConfig.type === 'text') {
          const textConfig = pageConfig as TextPageConfig;
          return {
            type: 'text',
            id: item.target,
            config: textConfig,
            content: getMarkdownContent(textConfig.source)
          } as PageData;
        } else if (pageConfig.type === 'card') {
          return {
            type: 'card',
            id: item.target,
            config: pageConfig as CardPageConfig
          } as PageData;
        } else if (pageConfig.type === 'pdf') {
          return {
            type: 'pdf',
            id: item.target,
            config: pageConfig as PdfPageConfig
          } as PageData;
        }
        return null;
      })
      .filter((item): item is PageData => item !== null);
  } else {
    if (aboutConfig) {
      pagesToShow = [{
        type: 'about',
        id: 'about',
        sections: processSections((aboutConfig as { sections: SectionConfig[] }).sections || [])
      }];
    }
  }

  return (
    <div className="max-w-6xl mx-auto min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-12 xl:py-14">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16">

        {/* Left Column - Profile */}
        <div className="self-start lg:sticky lg:top-28 lg:col-span-4">
          <Profile
            author={config.author}
            social={config.social}
            researchInterests={researchInterests}
          />
        </div>

        {/* Right Column - Content */}
        <div className="space-y-14 pb-4 lg:col-span-8 lg:pb-12">
          {pagesToShow.map((page) => (
            <section key={page.id} id={page.id} className="scroll-mt-24 space-y-12 sm:space-y-14">
              {page.type === 'about' && page.sections.map((section: SectionConfig) => {
                switch (section.type) {
                  case 'markdown':
                    return (
                      <About
                        key={section.id}
                        content={section.content || ''}
                        title={section.title}
                      />
                    );
                  case 'education':
                    return (
                      <Education
                        key={section.id}
                        title={section.title}
                        items={section.education || []}
                      />
                    );
                  default:
                    return null;
                }
              })}
              {page.type === 'publication' && (
                <PublicationsList
                  config={page.config}
                  publications={page.publications}
                  embedded={true}
                />
              )}
              {page.type === 'text' && (
                <TextPage
                  config={page.config}
                  content={page.content}
                  embedded={true}
                />
              )}
              {page.type === 'card' && (
                <CardPage
                  config={page.config}
                  embedded={true}
                />
              )}
              {page.type === 'pdf' && (
                <PdfPage
                  config={page.config}
                  embedded={true}
                />
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
