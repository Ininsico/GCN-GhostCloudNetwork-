
import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive, Cloud, File, Upload, Folder, MoreVertical, Shield } from 'lucide-react';

const StorageBuckets = () => {
    return (
        <div className="p-8 h-full overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter">DECENTRALIZED_VAULT</h1>
                    <p className="text-gray-400 text-sm">Encrypted sharding across the Anchor Network.</p>
                </div>
                <button className="bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/50 px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#39ff14]/20 transition flex items-center gap-2">
                    <Upload className="w-4 h-4" /> UPLOAD DATA
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Used Storage', value: '428.5 GB', total: '1 TB', color: '#39ff14' },
                    { label: 'Bandwidth', value: '1.2 TB', total: 'Unlimited', color: '#2dd4bf' },
                    { label: 'Gateway Req', value: '8.4M', total: 'Requests', color: '#f472b6' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl"
                    >
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <div className="flex items-end gap-2 mt-2">
                            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                            <span className="text-xs text-gray-500 font-bold mb-1">/ {stat.total}</span>
                        </div>
                        <div className="w-full bg-black h-1 rounded-full mt-4 overflow-hidden">
                            <div className="h-full" style={{ width: '45%', backgroundColor: stat.color }} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/5">
                    <h3 className="font-bold text-sm">Active Buckets</h3>
                    <div className="ml-auto flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><Shield className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                </div>
                <div>
                    {[
                        { name: 'backup-server-01', region: 'us-east', size: '124 GB', files: '14k', privacy: 'Private (Encrypted)' },
                        { name: 'public-assets-cdn', region: 'global', size: '45 GB', files: '8.2k', privacy: 'Public Read' },
                        { name: 'dataset-training-v4', region: 'eu-central', size: '200 GB', files: '12', privacy: 'Private' },
                    ].map((bucket, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                                <Folder className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm truncate">{bucket.name}</h4>
                                <p className="text-xs text-gray-500">{bucket.privacy}</p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="font-bold text-sm">{bucket.size}</p>
                                <p className="text-xs text-gray-500">{bucket.files} objects</p>
                            </div>
                            <div className="px-4">
                                <span className="text-[10px] font-mono bg-black/50 px-2 py-1 rounded text-gray-400">{bucket.region}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StorageBuckets;
