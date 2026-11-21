import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog';
import { withBasePath } from '@/lib/utils';

export const metadata: Metadata = { title: 'Blogs' };

export default function BlogsPage() {
  return (
    <div className="blog-index">
      <h1>Blogs</h1>
      {BLOG_POSTS.map((post, index) => (
      <Link key={post.slug} className="blog-entry" href={`/blogs/${post.slug}/`}>
        <div className="blog-entry-copy" lang="zh-CN">
          <time dateTime={post.date}>{post.date.replaceAll('-', '.')}</time>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <span className="read-essay">阅读全文 <span aria-hidden="true">↗</span></span>
        </div>
        <div className="blog-entry-image">
          <Image src={withBasePath(post.imageRoot + post.cover)} alt={post.coverAlt} width={1280} height={720} priority={index === 0} />
        </div>
      </Link>
      ))}
    </div>
  );
}
