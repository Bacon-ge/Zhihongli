import './blogs.css';

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <div className="blog-shell">{children}</div>;
}
