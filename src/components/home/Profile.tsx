'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import {
    EnvelopeIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import { MapPinIcon as MapPinSolidIcon, EnvelopeIcon as EnvelopeSolidIcon } from '@heroicons/react/24/solid';
import { Github, Linkedin, Pin } from 'lucide-react';
import { SiteConfig } from '@/lib/config';
import { withBasePath } from '@/lib/utils';
import { disclosureMotion, EASE_OUT, enterFromBelow } from '@/lib/motion';

// Brand marks remain small and restrained beside the primary email action.
const GoogleScholarIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path fill="#4285F4" d="M12 2.75 1.75 8.5 12 14.25 22.25 8.5 12 2.75Z" />
        <path fill="#AECBFA" d="M5.75 11.65v4.1c0 2.35 2.8 4.25 6.25 4.25s6.25-1.9 6.25-4.25v-4.1L12 15.15l-6.25-3.5Z" />
        <path fill="#3367D6" d="M20.4 9.55h1.35v6.7H20.4z" />
        <circle cx="21.08" cy="17.35" r="1.2" fill="#3367D6" />
    </svg>
);

const OrcidIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="#A6CE39"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    researchInterests?: string[];
}

export default function Profile({ author, social, researchInterests }: ProfileProps) {

    const shouldReduceMotion = Boolean(useReducedMotion());

    const [showAddress, setShowAddress] = useState(false);
    const [isAddressPinned, setIsAddressPinned] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [isEmailPinned, setIsEmailPinned] = useState(false);
    const [lastClickedTooltip, setLastClickedTooltip] = useState<'email' | 'address' | null>(null);

    const socialLinks = [
        ...(social.email ? [{
            name: 'Email',
            href: `mailto:${social.email}`,
            icon: EnvelopeIcon,
            isEmail: true,
        }] : []),
        ...(social.location || social.location_details ? [{
            name: 'Location',
            href: social.location_url || '#',
            icon: MapPinIcon,
            isLocation: true,
        }] : []),
        ...(social.google_scholar ? [{
            name: 'Google Scholar',
            href: social.google_scholar,
            icon: GoogleScholarIcon,
        }] : []),
        ...(social.orcid ? [{
            name: 'ORCID',
            href: social.orcid,
            icon: OrcidIcon,
        }] : []),
        ...(social.github ? [{
            name: 'GitHub',
            href: social.github,
            icon: Github,
        }] : []),
        ...(social.linkedin ? [{
            name: 'LinkedIn',
            href: social.linkedin,
            icon: Linkedin,
        }] : []),
    ];

    return (
        <motion.div
            {...enterFromBelow(shouldReduceMotion)}
            className="profile-panel"
        >
            {/* Profile Image */}
            <div className="mx-auto mb-5 h-52 w-52 max-w-[16rem] overflow-hidden rounded-[1.6rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)] sm:h-60 sm:w-60 lg:aspect-square lg:h-auto lg:w-full lg:max-w-[14rem] xl:max-w-[15rem]">
                <Image
                    src={withBasePath(author.avatar)}
                    alt={author.name}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover object-[32%_center]"
                    priority
                />
            </div>

            {/* Name and Title */}
            <div className="mb-4 text-center">
                <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-[2.15rem]">
                    {author.name}
                </h1>
                <p className="mb-1 text-[0.95rem] font-semibold tracking-wide text-accent">
                    {author.title}
                </p>
                <p className="mb-2 text-[0.95rem] leading-6 text-neutral-600">
                    {author.institution}
                </p>
            </div>

            {/* Contact Links */}
            <div className="relative mb-4 flex flex-wrap justify-center gap-3 px-2 sm:gap-4">
                {socialLinks.map((link) => {
                    const IconComponent = link.icon;
                    if (link.isLocation) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        if (!isAddressPinned) setShowAddress(true);
                                        setLastClickedTooltip('address');
                                    }}
                                    onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                    onClick={() => {
                                        setIsAddressPinned(!isAddressPinned);
                                        setShowAddress(!isAddressPinned);
                                        setLastClickedTooltip('address');
                                    }}
                                    className={`ui-pressable p-2.5 rounded-full hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${isAddressPinned
                                        ? 'text-accent'
                                        : 'text-neutral-600 hover:text-accent'
                                        }`}
                                    aria-label={link.name}
                                >
                                    {isAddressPinned ? (
                                        <MapPinSolidIcon className="h-5 w-5" />
                                    ) : (
                                        <MapPinIcon className="h-5 w-5" />
                                    )}
                                </button>

                                {/* Address tooltip */}
                                <AnimatePresence>
                                    {(showAddress || isAddressPinned) && (
                                        <motion.div
                                            {...disclosureMotion(shouldReduceMotion, 'down')}
                                            transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease: EASE_OUT }}
                                            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full origin-bottom bg-neutral-800 text-white px-4 py-3 rounded-xl text-sm font-medium shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap ${lastClickedTooltip === 'address' ? 'z-20' : 'z-10'
                                                }`}
                                            onMouseEnter={() => {
                                                if (!isAddressPinned) setShowAddress(true);
                                                setLastClickedTooltip('address');
                                            }}
                                            onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                        >
                                            <div className="text-center">
                                                <div className="flex items-center justify-center space-x-2 mb-1">
                                                    <p className="font-semibold">Work Address</p>
                                                    {!isAddressPinned && (
                                                        <div className="flex items-center space-x-0.5 text-xs text-neutral-400 opacity-60">
                                                            <Pin className="h-2.5 w-2.5" />
                                                            <span className="hidden sm:inline">Click</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {social.location_details?.map((line, i) => (
                                                    <p key={i} className="break-words">{line}</p>
                                                ))}
                                                <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                                                    {social.location_url && (
                                                        <a
                                                            href={social.location_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ui-pressable inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-3 py-1.5 rounded-md text-xs font-medium w-full sm:w-auto"
                                                        >
                                                            <MapPinIcon className="h-4 w-4" />
                                                            <span>Google Map</span>
                                                        </a>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }
                    if (link.isEmail) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        if (!isEmailPinned) setShowEmail(true);
                                        setLastClickedTooltip('email');
                                    }}
                                    onMouseLeave={() => !isEmailPinned && setShowEmail(false)}
                                    onClick={() => {
                                        setIsEmailPinned(!isEmailPinned);
                                        setShowEmail(!isEmailPinned);
                                        setLastClickedTooltip('email');
                                    }}
                                    className={`ui-pressable p-2.5 rounded-full hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${isEmailPinned
                                        ? 'text-accent'
                                        : 'text-neutral-600 hover:text-accent'
                                        }`}
                                    aria-label={link.name}
                                >
                                    {isEmailPinned ? (
                                        <EnvelopeSolidIcon className="h-5 w-5" />
                                    ) : (
                                        <EnvelopeIcon className="h-5 w-5" />
                                    )}
                                </button>

                                {/* Email tooltip */}
                                <AnimatePresence>
                                    {(showEmail || isEmailPinned) && (
                                        <motion.div
                                            {...disclosureMotion(shouldReduceMotion, 'down')}
                                            transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease: EASE_OUT }}
                                            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full origin-bottom bg-neutral-800 text-white px-4 py-3 rounded-xl text-sm font-medium shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap ${lastClickedTooltip === 'email' ? 'z-20' : 'z-10'
                                                }`}
                                            onMouseEnter={() => {
                                                if (!isEmailPinned) setShowEmail(true);
                                                setLastClickedTooltip('email');
                                            }}
                                            onMouseLeave={() => !isEmailPinned && setShowEmail(false)}
                                        >
                                            <div className="text-center">
                                                <div className="flex items-center justify-center space-x-2 mb-1">
                                                    <p className="font-semibold">Email</p>
                                                    {!isEmailPinned && (
                                                        <div className="flex items-center space-x-0.5 text-xs text-neutral-400 opacity-60">
                                                            <Pin className="h-2.5 w-2.5" />
                                                            <span className="hidden sm:inline">Click</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="break-words">{social.email?.replace('@', ' (at) ')}</p>
                                                <div className="mt-2">
                                                    <a
                                                        href={link.href}
                                                        className="ui-pressable inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-3 py-1.5 rounded-md text-xs font-medium w-full sm:w-auto"
                                                    >
                                                        <EnvelopeIcon className="h-4 w-4" />
                                                        <span className="sm:hidden">Send</span>
                                                        <span className="hidden sm:inline">Send Email</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ui-pressable p-2.5 rounded-full text-neutral-600 hover:text-accent hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                            aria-label={link.name}
                        >
                            <IconComponent className="h-5 w-5" />
                        </a>
                    );
                })}
            </div>

            {/* Research Interests */}
            {researchInterests && researchInterests.length > 0 && (
                <div className="profile-interests mb-7">
                    <h3 className="mb-3 font-serif text-lg font-semibold tracking-tight text-primary">Research Interests</h3>
                    <ul className="space-y-2 text-sm leading-5 text-neutral-700">
                        {researchInterests.map((interest, index) => (
                            <li
                                key={index}
                                className={`profile-interest ${interest === 'To be continued...' ? 'italic' : ''}`}
                            >
                                {interest}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </motion.div>
    );
}
