import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BLOG_SLUG, BLOG_TITLE, BLOG_IMAGE_ROOT } from '@/lib/blog';
import { withBasePath } from '@/lib/utils';

export const metadata: Metadata = { title: 'Blogs' };

export default function BlogsPage() {
  return (
    <div className="blog-index">
      <h1>Blogs</h1>
      <Link className="blog-entry" href={`/blogs/${BLOG_SLUG}/`}>
        <div className="blog-entry-copy" lang="zh-CN">
          <time dateTime="2026-11-16">2026.11.16</time>
          <h2>{BLOG_TITLE}</h2>
          <p>最近睡前总是在反思自己最近为什么总是浮躁，且一直缺乏“心气”。</p>
          <span className="read-essay">阅读全文 <span aria-hidden="true">↗</span></span>
        </div>
        <div className="blog-entry-image">
          <Image src={withBasePath(BLOG_IMAGE_ROOT + 'hero.webp')} alt="书桌前的人与涌来的纸张浪潮" width={1536} height={1024} priority />
        </div>
      </Link>
    </div>
  );
}
