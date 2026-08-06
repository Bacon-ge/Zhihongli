'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';
import { withBasePath } from '@/lib/utils';

type ShibaPose = 'sit' | 'down' | 'airplane' | 'wag';

const actionCycle: Array<Exclude<ShibaPose, 'down'>> = ['airplane', 'wag', 'sit'];

const poseAssets: Record<Exclude<ShibaPose, 'wag'>, string> = {
    sit: '/luncheon-meat-shiba-cutout.png',
    down: '/luncheon-meat-down.png',
    airplane: '/luncheon-meat-airplane.png',
};

export default function ShibaCompanion() {
    const shouldReduceMotion = Boolean(useReducedMotion());
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const followX = useSpring(pointerX, { stiffness: 90, damping: 18, mass: 0.7 });
    const followY = useSpring(pointerY, { stiffness: 90, damping: 18, mass: 0.7 });
    const [barkText, setBarkText] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isHappy, setIsHappy] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [pose, setPose] = useState<ShibaPose>('down');
    const reactionIndex = useRef(0);
    const barkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const happyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const poseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (shouldReduceMotion) return;

        const handlePointerMove = (event: PointerEvent) => {
            const horizontal = (event.clientX / window.innerWidth - 0.5) * 24;
            const vertical = (event.clientY / window.innerHeight - 0.5) * 16;
            pointerX.set(horizontal);
            pointerY.set(vertical);
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        return () => window.removeEventListener('pointermove', handlePointerMove);
    }, [pointerX, pointerY, shouldReduceMotion]);

    useEffect(() => {
        return () => {
            if (barkTimer.current) clearTimeout(barkTimer.current);
            if (happyTimer.current) clearTimeout(happyTimer.current);
            if (poseTimer.current) clearTimeout(poseTimer.current);
        };
    }, []);

    const petLuncheon = () => {
        const nextPose = actionCycle[reactionIndex.current % actionCycle.length];
        reactionIndex.current += 1;

        setIsHovered(false);
        setBarkText('Woof!');
        setPose(nextPose);
        setIsHappy(true);

        if (barkTimer.current) clearTimeout(barkTimer.current);
        barkTimer.current = setTimeout(() => setBarkText(''), 1200);

        if (happyTimer.current) clearTimeout(happyTimer.current);
        if (poseTimer.current) clearTimeout(poseTimer.current);
        happyTimer.current = setTimeout(() => setIsHappy(false), 720);
        poseTimer.current = setTimeout(() => setPose('down'), nextPose === 'wag' ? 2200 : 2800);
    };

    if (isHidden) {
        return (
            <button
                type="button"
                onClick={() => setIsHidden(false)}
                className="shiba-return ui-pressable"
                aria-label="Bring Luncheon back"
                title="Bring Luncheon back"
            >
                <span aria-hidden="true">🐾</span>
            </button>
        );
    }

    return (
        <motion.aside
            className="shiba-companion"
            style={shouldReduceMotion ? undefined : { x: followX, y: followY }}
            initial={{ opacity: 0, transform: shouldReduceMotion ? 'none' : 'translateY(12px) scale(0.96)' }}
            animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.32, ease: [0.23, 1, 0.32, 1] }}
            aria-label="Luncheon, a virtual Shiba Inu companion"
        >
            <AnimatePresence>
                {(barkText || isHovered) && (
                    <motion.div
                        className="shiba-message"
                        initial={{ opacity: 0, transform: shouldReduceMotion ? 'none' : 'translateY(5px) scale(0.97)' }}
                        animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
                        exit={{ opacity: 0, transform: shouldReduceMotion ? 'none' : 'translateY(3px) scale(0.98)' }}
                        transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <span>{barkText || 'Pet Luncheon'}</span>
                        {!barkText && <span className="shiba-message__hint">tap for a new pose</span>}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setIsHidden(true)}
                className="shiba-close ui-pressable"
                aria-label="Hide Luncheon"
                title="Hide Luncheon"
            >
                <XMarkIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
                type="button"
                onClick={petLuncheon}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocus={() => setIsHovered(true)}
                onBlur={() => setIsHovered(false)}
                className={cn('shiba-pet', isHappy && 'shiba-pet--happy')}
                aria-label="Pet Luncheon the Shiba Inu"
                title="Pet Luncheon"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={pose}
                        className="shiba-pose"
                        initial={{ opacity: 0, transform: shouldReduceMotion ? 'none' : 'translateY(3px) scale(0.98)' }}
                        animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
                        exit={{ opacity: 0, transform: shouldReduceMotion ? 'none' : 'translateY(2px) scale(0.99)' }}
                        transition={{ duration: shouldReduceMotion ? 0.08 : 0.18, ease: [0.23, 1, 0.32, 1] }}
                    >
                        {pose === 'wag' ? (
                            <>
                                <Image
                                    src={withBasePath('/luncheon-meat-wag-left.png')}
                                    alt=""
                                    width={512}
                                    height={512}
                                    className="shiba-photo shiba-wag-left"
                                    draggable={false}
                                />
                                <Image
                                    src={withBasePath('/luncheon-meat-wag-right.png')}
                                    alt=""
                                    width={512}
                                    height={512}
                                    className="shiba-photo shiba-wag-right"
                                    draggable={false}
                                />
                            </>
                        ) : (
                            <Image
                                src={withBasePath(poseAssets[pose])}
                                alt=""
                                width={512}
                                height={512}
                                className="shiba-photo"
                                draggable={false}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </button>
        </motion.aside>
    );
}
