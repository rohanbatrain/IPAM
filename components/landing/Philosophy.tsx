"use client";

import { motion } from "framer-motion";
import { GitBranch, Database } from "lucide-react";

export default function Philosophy() {
    return (
        <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#040508] to-[#0C0F15] justify-center items-center relative py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl bp3:text-3xl bp4:text-4xl font-light mb-6 text-white">
                        🔑 My Philosophy: Flexibility Without Compromise
                    </h2>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
                        The core philosophy behind Second Brain Database is simple: centralize your data, but never let platform dependency limit your flexibility.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 hover:bg-red-500/15 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <GitBranch className="w-6 h-6 text-red-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-red-400">The Problem</h3>
                        </div>
                        <p className="text-white/80 mb-4 leading-relaxed">
                            Traditional tools like Obsidian store data in a markdown-based format but rely heavily on platform-specific plugins. The moment you switch platforms, all that data becomes fragmented and loses its value.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-green-500/10 border border-green-500/20 rounded-lg p-8 hover:bg-green-500/15 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <Database className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-green-400">The Solution</h3>
                        </div>
                        <p className="text-white/80 mb-4 leading-relaxed">
                            Second Brain Database resolves this by using MongoDB to store data in a non-structured, platform-agnostic way. Whether you are using Flask v1, v2, or v3, the data remains consistent and usable across all tools.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
