import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getEssayHtml } from '@/lib/blog';
import { withBasePath } from '@/lib/utils';
import BlogReader from '@/components/blog/BlogReader';

const title = 'Promised to Be, Dazzling';
const imageRoot = '/blog-assets/2026-11-21/';

export const metadata: Metadata = {
  title,
  description: '在这个充满不确定的时代，我们却不被允许成为那个不确定的存在。',
  openGraph: { type: 'article', locale: 'zh_CN', title, publishedTime: '2026-11-21' },
};

export default function EssayPage() {
  return (
    <BlogReader>
      <article className="blog-article blog-article-dazzling" lang="zh-CN">
        <header className="blog-masthead">
          <h1 lang="en">Promised to Be, <span>Dazzling</span></h1>
          <time dateTime="2026-11-21">2026年11月21日</time>
        </header>
        <figure className="blog-cover">
          <button type="button" className="image-button" data-image={withBasePath(imageRoot + 'hero.jpg')} aria-label="放大封面插画">
            <Image src={withBasePath(imageRoot + 'hero.jpg')} alt="站在评测刻度前的年轻人" width={1280} height={720} priority />
          </button>
        </figure>
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: getEssayHtml('promised-to-be-dazzling') }} />
        <footer className="blog-article-footer">
          <Link href="/blogs/">← Blogs</Link>
        </footer>
      </article>
    </BlogReader>
  );
}
