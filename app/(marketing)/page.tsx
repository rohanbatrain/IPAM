"use client";

import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import GlobeDemo from "@/components/globe-demo";

export default function Home() {
    return (
        <>
            <Header />
            <div className="relative min-h-screen w-full h-full flex flex-col items-center overflow-hidden bg-[#040508]">
                <div className="w-full">
                    <Hero />
                    <Features />
                    <GlobeDemo />
                    <Testimonials />
                    <CTA />
                    <Footer />
                </div>
            </div>
        </>
    );
}
