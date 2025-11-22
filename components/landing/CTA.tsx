"use client";

import { motion } from "framer-motion";
import { Network, Shield, Activity, Zap } from "lucide-react";
import Link from "next/link";

export default function CTA() {
    return (
        <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#040508] to-[#0C0F15] justify-center items-center relative py-20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-6xl bp3:text-4xl bp4:text-5xl font-light mb-6 text-white">
                    Ready to Transform Your Network Management?
                </h2>
                <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12">
                    Join organizations worldwide using IPAM for intelligent, automated network infrastructure management.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                        <Network className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-white mb-2">Smart Allocation</h3>
                        <p className="text-white/70 text-sm">Automated IP assignment and subnet management</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                        <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-white mb-2">Enterprise Security</h3>
                        <p className="text-white/70 text-sm">Role-based access control and audit trails</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                        <Activity className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-white mb-2">Real-time Monitoring</h3>
                        <p className="text-white/70 text-sm">Live network status and instant alerts</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                        <Zap className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
                        <p className="text-white/70 text-sm">Optimized performance for large networks</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link href="/auth/signup">
                        <button className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-white font-medium text-lg rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
                            Get Started Free
                        </button>
                    </Link>
                    <Link href="/dashboard">
                        <button className="bg-white/10 backdrop-blur-sm px-8 py-4 text-white font-medium text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                            View Live Demo
                        </button>
                    </Link>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-white/60 mb-4">Trusted by network administrators worldwide</p>
                    <div className="flex justify-center gap-8 text-white/40 text-sm">
                        <span>Enterprise Ready</span>
                        <span>•</span>
                        <span>24/7 Support</span>
                        <span>•</span>
                        <span>99.9% Uptime</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
