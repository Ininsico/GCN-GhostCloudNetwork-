import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import axios from 'axios';

interface NodeLocation {
    id: string;
    lat: number;
    lng: number;
    name: string;
    status: string;
}

const NetworkMap: React.FC = () => {
    const [nodes, setNodes] = useState<NodeLocation[]>([]);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllNodes = async () => {
            try {
                // Fetch all available nodes for the global map
                const res = await axios.get('http://localhost:5000/api/compute/available', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                const mapped = res.data.map((n: any) => ({
                    id: n.nodeId,
                    lat: n.location?.lat || 0,
                    lng: n.location?.lng || 0,
                    name: n.name,
                    status: n.status
                }));
                setNodes(mapped);
            } catch (err) {
                console.error('Failed to fetch global nodes');
            }
        };

        fetchAllNodes();
        const interval = setInterval(fetchAllNodes, 10000);
        return () => clearInterval(interval);
    }, []);

    // Helper to project lat/lng to SVG coords (simplified)
    const project = (lat: number, lng: number) => {
        const x = (lng + 180) * (800 / 360);
        const y = (90 - lat) * (400 / 180);
        return { x, y };
    };

    return (
        <div className="relative w-full aspect-[2/1] bg-black/40 rounded-[40px] border border-white/5 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/5 to-transparent pointer-events-none" />

            {/* Minimalist World Map SVG */}
            <svg viewBox="0 0 800 400" className="w-full h-full opacity-20">
                <path
                    d="M150,150 L160,140 L180,145 L200,130 L250,140 L300,120 L350,110 L400,120 L450,150 L500,180 L550,220 L600,250 L650,270 L700,260 L750,250 L780,220 L800,200 L750,150 L700,100 L600,50 L500,30 L400,40 L300,60 L200,80 L150,100 Z"
                    fill="none"
                    stroke="#39ff14"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                />
                {/* Simplified continents as abstract lines */}
                <g stroke="#ffffff10" fill="none" strokeWidth="0.5">
                    <path d="M100,100 Q150,50 250,100 T400,150" />
                    <path d="M450,200 Q500,250 600,200 T750,150" />
                    <path d="M200,250 Q300,350 400,300" />
                </g>
            </svg>

            <div className="absolute top-6 left-8 flex items-center gap-3">
                <div className="p-2 bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-lg">
                    <Globe size={16} className="text-[#39ff14] animate-spin-slow" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest italic">Global_Edge_Topology</h3>
                    <p className="text-[10px] text-gray-500 font-mono">Nodes Active: {nodes.length}</p>
                </div>
            </div>

            {/* Nodes on the map */}
            <AnimatePresence>
                {nodes.map((node) => {
                    const { x, y } = project(node.lat, node.lng);
                    return (
                        <motion.g
                            key={node.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <circle
                                cx={x}
                                cy={y}
                                r="3"
                                fill={node.status === 'Online' ? '#39ff14' : '#f59e0b'}
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                            />
                            {node.status === 'Online' && (
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="6"
                                    fill="none"
                                    stroke="#39ff14"
                                    strokeWidth="0.5"
                                    className="animate-ping"
                                />
                            )}

                            {hoveredNode === node.id && (
                                <foreignObject x={x + 10} y={y - 20} width="120" height="40">
                                    <div className="bg-black/90 border border-[#39ff14]/50 rounded-lg p-2 backdrop-blur-xl">
                                        <p className="text-[8px] font-bold text-[#39ff14] truncate">{node.name}</p>
                                        <p className="text-[7px] text-gray-500 truncate">{node.id}</p>
                                    </div>
                                </foreignObject>
                            )}
                        </motion.g>
                    );
                })}
            </AnimatePresence>

            <div className="absolute bottom-6 right-8 text-right">
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Topology_Sense_v1.0</p>
                <p className="text-[10px] text-[#39ff14] font-mono">LAT_SYNC: OK</p>
            </div>
        </div>
    );
};

export default NetworkMap;
