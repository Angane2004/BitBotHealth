import { motion } from 'framer-motion';

export function UnlockingLockIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Lock body - stays still */}
            <rect x="6" y="11" width="12" height="11" rx="2" ry="2" />

            {/* Shackle (top part) - animates upward */}
            <motion.path
                d="M7 11V7a5 5 0 0 1 10 0"
                initial={{ y: 0 }}
                animate={{
                    y: [-2, -8, -2],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </svg>
    );
}
