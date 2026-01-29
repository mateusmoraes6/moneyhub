import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-950 overflow-hidden"
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />

            <div className="relative flex flex-col items-center gap-8">
                {/* Animated Logo Container */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut"
                    }}
                    className="relative"
                >
                    {/* Outer Glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"
                    />

                    <div className="relative bg-gray-900/50 p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden group">
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-emerald-500"
                        >
                            <motion.path
                                d="M21 12V7H5a2 2 0 0 1 0-4h14v4"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M3 5v14a2 2 0 0 0 2 2h16v-5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                            />
                            <motion.path
                                d="M18 12a2 2 0 0 0 0 4h4v-4Z"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                            />
                        </motion.svg>
                    </div>
                </motion.div>

                {/* Text Animation */}
                <div className="flex flex-col items-center gap-2">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-3xl font-bold tracking-tighter text-white"
                    >
                        Money<span className="text-emerald-500">Hub</span>
                    </motion.h1>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 100 }}
                        transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
                        className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="text-gray-500 text-xs uppercase tracking-[0.2em] font-medium"
                    >
                        Organizando seu futuro
                    </motion.p>
                </div>
            </div>

            {/* Loading Bar at physical bottom */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    animate={{
                        x: ["-100%", "100%"]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-full h-full bg-emerald-500/50"
                />
            </div>
        </motion.div>
    );
};

export default SplashScreen;
