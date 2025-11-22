"use client";

import { motion } from "framer-motion";
import { Network, Shield, Activity, Zap, Github, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-16 container mx-auto px-4 z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6 flex flex-col gap-8 items-center justify-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block"
                >
                    <span className="relative px-4 py-2 rounded-xl flex flex-row gap-2 items-center bg-white/10 text-sm text-white/90 backdrop-blur-sm border border-white/10 overflow-hidden">
                        <motion.div
                            className="absolute top-0 w-[10px] h-full bg-cyan-300 opacity-60 blur-md shadow-2xl"
                            initial={{ left: "-10%" }}
                            animate={{ left: "110%" }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "linear",
                            }}
                        />
                        <Network className="w-4 h-4 relative z-10" />
                        <p className="relative z-10">
                            ENTERPRISE IP ADDRESS MANAGEMENT
                        </p>
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-6xl bp3:text-4xl bp4:text-5xl text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] font-bold tracking-tight"
                >
                    Intelligent Network <br className="hidden md:block" /> Management Made Simple
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="max-w-3xl mx-auto text-lg text-white/80 leading-relaxed"
                >
                    Comprehensive IP address management with automated allocation, subnet visualization, DHCP integration, and real-time monitoring. Built for modern networks with enterprise-grade security and scalability.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto w-full"
                >
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                        <Network className="w-8 h-8 text-cyan-400 shrink-0" />
                        <div className="text-left">
                            <p className="text-white font-medium">Smart Allocation</p>
                            <p className="text-white/60 text-sm">Automated IP assignment & tracking</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                        <Shield className="w-8 h-8 text-green-400 shrink-0" />
                        <div className="text-left">
                            <p className="text-white font-medium">Security First</p>
                            <p className="text-white/60 text-sm">Role-based access & audit logs</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                        <Activity className="w-8 h-8 text-purple-400 shrink-0" />
                        <div className="text-left">
                            <p className="text-white font-medium">Real-time Monitoring</p>
                            <p className="text-white/60 text-sm">Live network status & alerts</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4 items-center justify-center"
                >
                    <Link href="/auth/signup">
                        <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
                            Get Started Free
                        </button>
                    </Link>
                    <Link href="/dashboard">
                        <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                            View Demo
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
