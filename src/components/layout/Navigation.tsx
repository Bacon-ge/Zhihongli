'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { SiteConfig } from '@/lib/config';
import { disclosureMotion, EASE_OUT } from '@/lib/motion';

interface NavigationProps {
  items: SiteConfig['navigation'];
  siteTitle: string;
  enableOnePageMode?: boolean;
}

export default function Navigation({ items, siteTitle, enableOnePageMode }: NavigationProps) {
  const pathname = usePathname();
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (enableOnePageMode) {
      // Set initial hash on client-side to avoid hydration mismatch
      setActiveHash(window.location.hash);
      const handleHashChange = () => setActiveHash(window.location.hash);
      window.addEventListener('hashchange', handleHashChange);

      // Scroll Spy Logic
      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Update active hash based on intersecting section
            const id = entry.target.id;
            // Only update if we are not currently scrolling to a target (optional refinement, 
            // but for now simple intersection is enough, we might want to debounce or check intersection ratio)
            // We use history.replaceState to update URL without jumping or window.location.hash which might jump
            // But for the nav highlighting, we just need to update local state if we want it to be responsive
            // However, the requirement says "nav bar did not change". 
            // Let's update the activeHash state.
            setActiveHash(id === 'about' ? '' : `#${id}`);
          }
        });
      };

      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Adjust these margins to trigger when section is roughly in view
        threshold: 0
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

      // Observe all sections
      items.forEach(item => {
        if (item.type === 'page') {
          const element = document.getElementById(item.target);
          if (element) observer.observe(element);
        }
      });

      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        observer.disconnect();
      };
    }
  }, [enableOnePageMode, items]);

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50">
      {({ open }) => (
        <>
          <motion.div
            initial={{ opacity: 0, transform: shouldReduceMotion ? 'none' : 'translateY(-8px)' }}
            animate={{ opacity: 1, transform: 'translateY(0)' }}
            transition={{ duration: 0.26, ease: EASE_OUT }}
            className={cn(
              'border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200',
              scrolled
                ? 'bg-[var(--nav-surface)] backdrop-blur-xl border-[var(--border-subtle)] shadow-[0_8px_28px_rgba(32,39,53,0.06)]'
                : 'bg-background/80 backdrop-blur-md border-transparent'
            )}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16 lg:h-20">
                {/* Logo/Name */}
                <div className="flex-shrink-0 min-w-0">
                  <Link
                    href="/"
                    className="ui-pressable block truncate rounded-sm text-lg sm:text-xl lg:text-2xl font-serif font-semibold tracking-tight text-primary hover:text-accent"
                  >
                    {siteTitle}
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:block">
                  <div className="ml-10 flex items-center space-x-8">
                    <div className="flex items-baseline space-x-8">
                      {items.map((item) => {
                        const isActive = enableOnePageMode
                          ? activeHash === `#${item.target}` || (!activeHash && item.target === 'about')
                          : (item.href === '/'
                            ? pathname === '/'
                            : pathname.startsWith(item.href));

                        const href = enableOnePageMode
                          ? `/#${item.target}`
                          : item.href;

                        return (
                          <Link
                            key={item.title}
                            href={href}
                            prefetch={true}
                            onClick={() => enableOnePageMode && setActiveHash(`#${item.target}`)}
                            className={cn(
                              'ui-pressable relative px-2 py-2 text-sm font-medium',
                              isActive
                                ? 'text-primary'
                                : 'text-neutral-600 hover:text-primary'
                            )}
                          >
                            <span className="relative z-10">{item.title}</span>
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute inset-x-2 -bottom-0.5 h-px bg-accent"
                                initial={false}
                                transition={{
                                  type: 'spring',
                                  duration: shouldReduceMotion ? 0 : 0.35,
                                  bounce: 0
                                }}
                              />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="lg:hidden flex items-center space-x-2">
                  <Disclosure.Button
                    className="ui-pressable inline-flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:text-primary hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                    aria-label={open ? 'Close main menu' : 'Open main menu'}
                  >
                    <span className="sr-only">{open ? 'Close main menu' : 'Open main menu'}</span>
                    <motion.div
                      animate={{ transform: shouldReduceMotion ? 'none' : `rotate(${open ? 90 : 0}deg)` }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: EASE_OUT }}
                    >
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </motion.div>
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {open && (
              <Disclosure.Panel static>
                <motion.div
                  {...disclosureMotion(shouldReduceMotion)}
                  transition={{ duration: shouldReduceMotion ? 0.12 : 0.2, ease: EASE_OUT }}
                  className="lg:hidden origin-top bg-[var(--nav-surface)] backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-[0_16px_36px_rgba(32,39,53,0.10)]"
                >
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {items.map((item) => {
                      const isActive = enableOnePageMode
                        ? (item.href === '/' ? pathname === '/' && !activeHash : activeHash === `#${item.target}`)
                        : (item.href === '/'
                          ? pathname === '/'
                          : pathname.startsWith(item.href));

                      const href = enableOnePageMode
                        ? (item.href === '/' ? '/' : `/#${item.target}`)
                        : item.href;

                      return (
                        <div key={item.title}>
                          <Disclosure.Button
                            as={Link}
                            href={href}
                            prefetch={true}
                            onClick={() => enableOnePageMode && setActiveHash(item.href === '/' ? '' : `#${item.target}`)}
                            className={cn(
                              'ui-pressable block px-3 py-2 rounded-lg text-base font-medium',
                              isActive
                                ? 'text-primary bg-accent/10 border-l-4 border-accent'
                                : 'text-neutral-600 hover:text-primary hover:bg-neutral-50'
                            )}
                          >
                            {item.title}
                          </Disclosure.Button>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
