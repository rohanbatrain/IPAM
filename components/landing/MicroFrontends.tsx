"use client";

import { motion } from "framer-motion";
import { Brain, Database } from "lucide-react";
import { HoverBorderGradient } from "@/components/components/FramerButton";

export default function MicroFrontends() {
    return (
        <section className="min-h-screen w-full flex flex-col bg-gradient-to-b to-[#040508] from-[#0C0F15] justify-center items-center relative py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl bp3:text-3xl bp4:text-4xl font-light mb-6 text-white">
                        🧠 Micro Frontends: Solving Complex Problems Simply
                    </h2>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
                        The project incorporates micro frontends to keep things modular and focused.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <Brain className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white">Emotion Capture</h3>
                        </div>
                        <p className="text-white/80 mb-4">
                            A specialized frontend designed specifically to capture and store emotions without overwhelming you with other features.
                        </p>
                        <ul className="text-white/70 space-y-2">
                            <li>• Focused emotion tracking</li>
                            <li>• Minimal interface</li>
                            <li>• Direct database integration</li>
                            <li>• Task-specific functionality</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Database className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white">IPAM</h3>
                        </div>
                        <p className="text-white/80 mb-4">
                            Intelligent IP Address Management with hierarchical allocation, real-time monitoring, and audit trails.
                        </p>
                        <ul className="text-white/70 space-y-2">
                            <li>• Hierarchical Allocation</li>
                            <li>• Real-time Monitoring</li>
                            <li>• Audit Trails</li>
                            <li>• Network Analytics</li>
                        </ul>
                    </motion.div>
                </div>

                <div className="flex justify-center mt-12">
                    <HoverBorderGradient
                        className="bg-gradient-to-b from-green-600 to-green-800 px-8 py-3 text-white font-medium rounded-full mx-auto"
                        onClick={() => window.location.href = '/microfrontends'}
                    >
                        Explore Microfrontends
                    </HoverBorderGradient>
                </div>
            </div>
        </section>
    );
}
