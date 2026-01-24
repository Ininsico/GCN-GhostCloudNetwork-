
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Play, Plus, MoreHorizontal, Database, Clock } from 'lucide-react';

const Notebooks = () => {
    const notebooks = [
        { id: 1, name: 'GenAI-FineTuning-Llama3', kernel: 'Python 3.10 (GPU)', status: 'Running', lastEdited: '2 mins ago', size: '1.2 GB' },
        { id: 2, name: 'Market-Trend-Analysis-2025', kernel: 'PySpark', status: 'Stopped', lastEdited: '2 days ago', size: '450 MB' },
        { id: 3, name: 'Untitled-Experiment-01', kernel: 'R 4.2', status: 'Idle', lastEdited: '1 week ago', size: '12 KB' },
    ];

    return (
        <div className="p-8 space-y-6 h-full overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter">AI_LAB_NOTEBOOKS</h1>
                    <p className="text-gray-400 text-sm">Interactive development environments on the edge.</p>
                </div>
                <button className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition flex items-center gap-2 shadow-lg shadow-white/10">
                    <Plus className="w-4 h-4" /> NEW NOTEBOOK
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {notebooks.map((nb, i) => (
                    <motion.div
                        key={nb.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-white/5 border border-white/10 hover:border-[#39ff14]/50 rounded-2xl p-4 flex items-center gap-6 transition-all hover:bg-white/10"
                    >
                        {/* Icon */}
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="text-lg font-bold group-hover:text-[#39ff14] transition-colors">{nb.name}</h3>
                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                <span className="flex items-center gap-1"><Code className="w-3 h-3" /> {nb.kernel}</span>
                                <span className="flex items-center gap-1"><Database className="w-3 h-3" /> {nb.size}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> edited {nb.lastEdited}</span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="px-4">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${nb.status === 'Running'
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : nb.status === 'Idle'
                                    ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                                    : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${nb.status === 'Running' ? 'bg-green-400 animate-pulse' : nb.status === 'Idle' ? 'bg-yellow-400' : 'bg-gray-400'}`} />
                                {nb.status.toUpperCase()}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white" title="Run">
                                <Play className="w-5 h-5 fill-current" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State / Call to Action */}
            <div className="mt-8 border border-dashed border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Database className="w-8 h-8 text-gray-500 group-hover:text-[#39ff14]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Import Data Set</h3>
                <p className="text-gray-400 text-sm max-w-md">Connect your S3 buckets, Google Drive, or local CSVs to start training models instantly on the decentralized cloud.</p>
            </div>
        </div>
    );
};

export default Notebooks;
