"use client";

import { BookOpen, Code, Star } from "lucide-react";

export default function TechStack() {
    return (
        <section className="min-h-screen w-full flex flex-col bg-gradient-to-b to-[#040508] from-[#0C0F15] justify-center items-center relative py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-5xl bp3:text-3xl bp4:text-4xl font-light mb-6 text-white">
                        Technical Architecture
                    </h2>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        Built with cutting-edge technologies for production-ready performance
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 max-w-4xl mx-auto mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-semibold text-white mb-6">Backend & Database</h3>
                            <div className="space-y-4">
                                <TechItem name="FastAPI" status="Production Ready" />
                                <TechItem name="MongoDB 6.0+" status="Production Ready" />
                                <TechItem name="Redis 7.0+" status="Production Ready" />
                                <TechItem name="Celery + Flower" status="Production Ready" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-white mb-6">AI & Intelligence</h3>
                            <div className="space-y-4">
                                <TechItem name="Ollama + LlamaIndex" status="Production Ready" />
                                <TechItem name="Qdrant Vector DB" status="Production Ready" />
                                <TechItem name="Docling OCR" status="Production Ready" />
                                <TechItem name="FastMCP 2.x" status="Production Ready" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-5xl bp3:text-3xl bp4:text-4xl font-light mb-6 text-white">
                        Developer Experience
                    </h2>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        Get started in minutes with automated setup and comprehensive documentation
                    </p>
                </div>

                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 border border-white/10 max-w-4xl mx-auto font-mono text-sm w-full">
                    <div className="text-green-400 mb-4"># Clone and setup in 2 minutes</div>
                    <div className="text-white mb-2">git clone https://github.com/rohanbatrain/second_brain_database.git</div>
                    <div className="text-white mb-2">cd second_brain_database</div>
                    <div className="text-white mb-4">./start.sh</div>
                    <div className="text-blue-400 mb-4">✓ All services started successfully!</div>
                    <div className="text-blue-400">✓ FastAPI on http://localhost:8000</div>
                    <div className="text-blue-400">✓ MongoDB, Redis, Ollama ready</div>
                    <div className="text-green-400 mt-6 mb-2"># Or pull the Docker image</div>
                    <div className="text-white">docker pull rohanbatra/second_brain_database:latest</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16 w-full">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Interactive Docs</h3>
                        <p className="text-white/70">Swagger UI at /docs, ReDoc at /redoc</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Code className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">REST APIs</h3>
                        <p className="text-white/70">Complete REST API with WebSocket support</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">MCP Tools</h3>
                        <p className="text-white/70">138+ tools for AI agent integration</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TechItem({ name, status }: { name: string, status: string }) {
    return (
        <div className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
            <span className="text-white/80">{name}</span>
            <span className="text-green-400 text-sm flex items-center gap-1">
                ✅ {status}
            </span>
        </div>
    );
}
