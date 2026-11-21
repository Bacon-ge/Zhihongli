import fs from 'fs';
import path from 'path';
import { withBasePath } from './utils';

export const BLOG_SLUG = 'ai-collaboration-exhaustion';
export const BLOG_TITLE = '和AI协作完成任务总是会让我心力交瘁';
export const BLOG_IMAGE_ROOT = '/blog-assets/2026-11-16/';

export const BLOG_POSTS = [
  {
    slug: 'promised-to-be-dazzling',
    title: 'Promised to Be, Dazzling',
    date: '2026-11-21',
    excerpt: '看完《模型一代》和相关与之对话的文章，有一种说不清道不明的失落和迷茫。',
    imageRoot: '/blog-assets/2026-11-21/',
    cover: 'hero.jpg',
    coverAlt: '站在评测刻度前的年轻人',
  },
  {
    slug: BLOG_SLUG,
    title: BLOG_TITLE,
    date: '2026-11-16',
    excerpt: '最近睡前总是在反思自己最近为什么总是浮躁，且一直缺乏“心气”。',
    imageRoot: BLOG_IMAGE_ROOT,
    cover: 'hero.webp',
    coverAlt: '书桌前的人与涌来的纸张浪潮',
  },
] as const;

/** Authored local content, generated from the author's Markdown. Never accepts remote HTML. */
export function getEssayHtml(slug: (typeof BLOG_POSTS)[number]['slug'] = BLOG_SLUG): string {
  const post = BLOG_POSTS.find((post) => post.slug === slug);
  if (!post) throw new Error(`Unknown blog: ${slug}`);
  const article = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/blogs', `${post.slug}.json`), 'utf8')) as { content_html: string };
  return article.content_html.replace(/(src|data-image)="assets\/([^"]+)"/g,
    (_, attribute: string, filename: string) => `${attribute}="${withBasePath(post.imageRoot + filename)}"`);
}
