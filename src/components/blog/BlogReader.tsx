'use client';

import { useRef, useState, type MouseEvent, type ReactNode } from 'react';

export default function BlogReader({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [image, setImage] = useState<{ src: string; alt: string } | null>(null);

  function openImage(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>('button[data-image]');
    if (!button?.dataset.image) return;
    setImage({ src: button.dataset.image, alt: button.querySelector('img')?.alt || '文章配图' });
    dialogRef.current?.showModal();
  }

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
      event.currentTarget.close();
    }
  }

  return (
    <div className="blog-reader" onClick={openImage}>
      {children}
      <dialog ref={dialogRef} className="blog-lightbox" aria-label="图片大图" onClick={closeOnBackdrop} onClose={() => setImage(null)}>
        <button type="button" className="blog-lightbox-close" aria-label="关闭大图" onClick={() => dialogRef.current?.close()}>×</button>
        {/* Full-size originals have different aspect ratios and intentionally retain their natural dimensions. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image ? <div className={image.src.endsWith('kokuyo-todo.jpg') ? 'blog-zoom-media blog-zoom-product' : 'blog-zoom-media'}><img src={image.src} alt={image.alt} /></div> : null}
      </dialog>
    </div>
  );
}
