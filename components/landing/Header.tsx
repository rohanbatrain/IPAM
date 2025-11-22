"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Network } from "lucide-react";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#040508]/80 backdrop-blur-md border-b border-white/10"
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-cyan-500/20 rounded-lg">
                        <Network className="w-5 h-5 text-cyan-500" />
                    </div>
                    <span className="text-xl font-bold text-white">IPAM</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#features" className="text-white/80 hover:text-white transition-colors">
                        Features
                    </Link>
                    <Link href="#testimonials" className="text-white/80 hover:text-white transition-colors">
                        Testimonials
                    </Link>
                    <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                </nav>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/auth/login">
                        <button className="px-6 py-2 text-white hover:bg-white/10 rounded-lg transition-colors border border-white/20">
                            Sign In
                        </button>
                    </Link>
                    <Link href="/auth/signup">
                        <button className="px-6 py-2 bg-gradient-to-b from-cyan-600 to-cyan-800 text-white rounded-lg transition-all duration-300 border border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
                            Get Started
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-white p-2"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-[#040508] border-t border-white/10"
                >
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        <Link href="#features" className="block text-white/80 hover:text-white py-2">
                            Features
                        </Link>
                        <Link href="#testimonials" className="block text-white/80 hover:text-white py-2">
                            Testimonials
                        </Link>
                        <Link href="/dashboard" className="block text-white/80 hover:text-white py-2">
                            Dashboard
                        </Link>
                        <div className="pt-4 space-y-2">
                            <Link href="/auth/login" className="block">
                                <button className="w-full px-6 py-2 text-white hover:bg-white/10 rounded-lg transition-colors border border-white/20">
                                    Sign In
                                </button>
                            </Link>
                            <Link href="/auth/signup" className="block">
                                <button className="w-full px-6 py-2 bg-gradient-to-b from-cyan-600 to-cyan-800 text-white rounded-lg transition-all duration-300 border border-cyan-500/50">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}
