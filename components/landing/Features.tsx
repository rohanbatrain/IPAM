"use client";

import { motion } from "framer-motion";
import { Database, Brain, Code, GitBranch, Star, Users, Shield } from "lucide-react";
import { useState } from "react";

export default function Features() {
    const [activeTab, setActiveTab] = useState<'planning' | 'management' | 'automation'>('planning');

    return (
        <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#040508] to-[#0C0F15] justify-center items-center relative py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl bp3:text-3xl bp4:text-4xl font-light mb-6 text-white"
                    >
                        Everything You Need to Manage Networks
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/70 max-w-3xl mx-auto mb-12"
                    >
                        Comprehensive IP address management and network planning tools for modern infrastructure
                    </motion.p>

                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-1 border border-white/10">
                            <div className="flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => setActiveTab('planning')}
                                    className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'planning'
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Network Planning
                                </button>
                                <button
                                    onClick={() => setActiveTab('management')}
                                    className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'management'
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    IP Management
                                </button>
                                <button
                                    onClick={() => setActiveTab('automation')}
                                    className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'automation'
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Automation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Network Planning Tab */}
                {activeTab === 'planning' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
                    >
                        <FeatureCard
                            icon={<GitBranch className="w-6 h-6 text-cyan-400" />}
                            iconBg="bg-cyan-500/20"
                            title="Subnet Calculator"
                            description="Plan your network topology with advanced subnet calculations and CIDR notation support."
                            list={[
                                "CIDR to subnet mask conversion",
                                "Network and broadcast address calculation",
                                "Usable host range determination",
                                "VLSM support for efficient IP allocation"
                            ]}
                        />
                        <FeatureCard
                            icon={<Database className="w-6 h-6 text-blue-400" />}
                            iconBg="bg-blue-500/20"
                            title="Hierarchical Organization"
                            description="Organize your IP space with nested networks, VLANs, and logical groupings."
                            list={[
                                "Multi-level network hierarchy",
                                "VLAN management and tagging",
                                "Custom organizational units",
                                "Geographic and functional grouping"
                            ]}
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Brain className="w-6 h-6 text-purple-400" />}
                            iconBg="bg-purple-500/20"
                            title="Capacity Planning"
                            description="Visualize IP utilization and plan for future growth with intelligent forecasting."
                            list={[
                                "Real-time utilization metrics",
                                "Growth trend analysis",
                                "Capacity alerts and warnings",
                                "Subnet exhaustion predictions"
                            ]}
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Star className="w-6 h-6 text-green-400" />}
                            iconBg="bg-green-500/20"
                            title="Visual Network Maps"
                            description="Interactive topology visualization to understand your network structure at a glance."
                            list={[
                                "Interactive network diagrams",
                                "Subnet relationship visualization",
                                "Color-coded utilization heatmaps",
                                "Export to standard formats"
                            ]}
                            delay={0.3}
                        />
                    </motion.div>
                )}

                {/* IP Management Tab */}
                {activeTab === 'management' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
                    >
                        <FeatureCard
                            icon={<Database className="w-6 h-6 text-blue-400" />}
                            iconBg="bg-blue-500/20"
                            title="IP Address Tracking"
                            description="Comprehensive IP address lifecycle management from allocation to decommission."
                            list={[
                                "Static and dynamic IP assignment",
                                "Reservation management",
                                "MAC address binding",
                                "Hostname and DNS integration"
                            ]}
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-amber-400" />}
                            iconBg="bg-amber-500/20"
                            title="Conflict Detection"
                            description="Prevent IP conflicts with real-time validation and automated checks."
                            list={[
                                "Duplicate IP detection",
                                "Overlapping subnet warnings",
                                "Reserved range protection",
                                "Automated conflict resolution"
                            ]}
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Code className="w-6 h-6 text-pink-400" />}
                            iconBg="bg-pink-500/20"
                            title="DHCP Integration"
                            description="Seamlessly integrate with DHCP servers for dynamic address management."
                            list={[
                                "DHCP scope synchronization",
                                "Lease tracking and monitoring",
                                "Pool utilization metrics",
                                "Automatic lease expiration"
                            ]}
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-green-400" />}
                            iconBg="bg-green-500/20"
                            title="Multi-Tenant Support"
                            description="Manage multiple organizations or departments with isolated IP spaces."
                            list={[
                                "Tenant isolation and security",
                                "Per-tenant quotas and limits",
                                "Role-based access control",
                                "Delegated administration"
                            ]}
                            delay={0.3}
                        />
                    </motion.div>
                )}

                {/* Automation Tab */}
                {activeTab === 'automation' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
                    >
                        <FeatureCard
                            icon={<Code className="w-6 h-6 text-purple-400" />}
                            iconBg="bg-purple-500/20"
                            title="RESTful API"
                            description="Comprehensive API for integration with your existing infrastructure and workflows."
                            list={[
                                "Full CRUD operations",
                                "Bulk import/export",
                                "Webhook notifications",
                                "OpenAPI documentation"
                            ]}
                        />
                        <FeatureCard
                            icon={<GitBranch className="w-6 h-6 text-blue-400" />}
                            iconBg="bg-blue-500/20"
                            title="Automated Workflows"
                            description="Define custom workflows for IP allocation, approval processes, and lifecycle management."
                            list={[
                                "Approval workflows",
                                "Automated provisioning",
                                "Scheduled tasks",
                                "Event-driven actions"
                            ]}
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-orange-400" />}
                            iconBg="bg-orange-500/20"
                            title="Audit & Compliance"
                            description="Complete audit trails and compliance reporting for regulatory requirements."
                            list={[
                                "Comprehensive change logs",
                                "User activity tracking",
                                "Compliance reports",
                                "Historical data retention"
                            ]}
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Brain className="w-6 h-6 text-cyan-400" />}
                            iconBg="bg-cyan-500/20"
                            title="Smart Allocation"
                            description="AI-powered IP allocation suggestions based on usage patterns and best practices."
                            list={[
                                "Intelligent IP suggestions",
                                "Optimal subnet sizing",
                                "Usage pattern analysis",
                                "Best practice recommendations"
                            ]}
                            delay={0.3}
                        />
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function FeatureCard({ icon, iconBg, title, description, list, delay = 0 }: {
    icon: React.ReactNode,
    iconBg: string,
    title: string,
    description: string,
    list: string[],
    delay?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
                <h3 className="text-2xl font-semibold text-white">{title}</h3>
            </div>
            <p className="text-white/80 mb-4">
                {description}
            </p>
            <ul className="text-white/70 space-y-2">
                {list.map((item, i) => (
                    <li key={i}>• {item}</li>
                ))}
            </ul>
        </motion.div>
    );
}
