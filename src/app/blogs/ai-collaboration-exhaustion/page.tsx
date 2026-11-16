import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BLOG_TITLE, BLOG_IMAGE_ROOT, getEssayHtml } from '@/lib/blog';
import { withBasePath } from '@/lib/utils';
import BlogReader from '@/components/blog/BlogReader';

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: '从高中待办清单上的一个勾，到 AI 时代无法并行的注意力。',
  openGraph: { type: 'article', locale: 'zh_CN', title: BLOG_TITLE, publishedTime: '2026-11-16' },
};

export default function EssayPage() {
  return (
    <BlogReader>
      <article className="blog-article" lang="zh-CN">
        <header className="blog-masthead">
          <h1>和AI协作完成任务<br />总是会让我<span>心力交瘁。</span></h1>
          <time dateTime="2026-11-16">2026年11月16日</time>
        </header>
        <figure className="blog-cover">
          <button type="button" className="image-button" data-image={withBasePath(BLOG_IMAGE_ROOT + 'hero.webp')} aria-label="放大封面插画">
            <Image src={withBasePath(BLOG_IMAGE_ROOT + 'hero.webp')} alt="纸张如浪潮般涌来，一个人独自坐在书桌前" width={1536} height={1024} priority />
          </button>
        </figure>
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: getEssayHtml() }} />
        <footer className="blog-article-footer">
          <Link href="/blogs/">← Blogs</Link>
        </footer>
      </article>
    </BlogReader>
  );
}
