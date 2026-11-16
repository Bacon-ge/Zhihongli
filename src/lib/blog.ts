import fs from 'fs';
import path from 'path';
import { withBasePath } from './utils';

export const BLOG_SLUG = 'ai-collaboration-exhaustion';
export const BLOG_TITLE = '和AI协作完成任务总是会让我心力交瘁';
export const BLOG_IMAGE_ROOT = '/blog-assets/2026-11-16/';

/** Authored local content, generated from the author's Markdown. Never accepts remote HTML. */
export function getEssayHtml(): string {
  const article = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/blogs', `${BLOG_SLUG}.json`), 'utf8')) as { content_html: string };
  return article.content_html.replace(/(src|data-image)="assets\/([^"]+)"/g,
    (_, attribute: string, filename: string) => `${attribute}="${withBasePath(BLOG_IMAGE_ROOT + filename)}"`);
}
