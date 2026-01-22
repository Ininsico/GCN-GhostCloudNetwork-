import React, { useState } from 'react';
import { Play, Code, Package, Terminal } from 'lucide-react';
import axios from 'axios';

interface ScriptRunnerProps {
    nodeId: string;
}

const ScriptRunner: React.FC<ScriptRunnerProps> = ({ nodeId }) => {
    const [sourceCode, setSourceCode] = useState(`// Welcome to Anchor REX
// This script runs on the raw hardware of the target machine.
console.log("Starting hardware-level task...");

// Example: Heavy computation
let result = 0;
for(let i=0; i<10000000; i++) {
    result += Math.sqrt(i);
}

console.log("Computation result:", result);
console.log("Node RAM Access verified.");
`);
    const [dependencies, setDependencies] = useState<string>('fs-extra');
    const [output, setOutput] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        setOutput(null);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/tasks', {
                name: 'REX_Custom_Script',
                type: 'Script_Deployment',
                payload: {
                    sourceCode,
                    dependencies: dependencies.split(',').map(d => d.trim()).filter(d => d),
                }
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const taskId = res.data._id;

            // Poll for results
            const pollInterval = setInterval(async () => {
                const checkRes = await axios.get(`http://localhost:5000/api/tasks`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const task = checkRes.data.find((t: any) => t._id === taskId);

                if (task.status === 'Completed' || task.status === 'Failed') {
                    setOutput(task.result);
                    setLoading(false);
                    clearInterval(pollInterval);
                }
            }, 2000);

        } catch (err: any) {
            alert('Failed to deploy script: ' + (err.response?.data?.message || err.message));
            setLoading(false);
        }
    };

    return (
        <div className="bg-stone-900 border border-white/10 rounded-3xl overflow-hidden mt-6">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#39ff14]/10 rounded-xl text-[#39ff14]">
                        <Code size={18} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Remote Execution Engine (REX)</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Hardware-Level Scripting</p>
                    </div>
                </div>
                <button
                    onClick={handleRun}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#39ff14] text-black rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                    {loading ? <Terminal className="animate-spin" size={14} /> : <Play size={14} fill="black" />}
                    {loading ? 'EXECUTING...' : 'RUN ON NODE'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-6 border-r border-white/5 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                            <Code size={12} /> Source Code (Node.js)
                        </label>
                        <textarea
                            value={sourceCode}
                            onChange={(e) => setSourceCode(e.target.value)}
                            className="w-full h-48 bg-black text-gray-300 font-mono text-xs p-4 rounded-2xl border border-white/5 focus:border-[#39ff14]/30 outline-none resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                            <Package size={12} /> External Dependencies (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={dependencies}
                            onChange={(e) => setDependencies(e.target.value)}
                            className="w-full bg-black text-gray-300 font-mono text-xs p-3 rounded-xl border border-white/5 focus:border-[#39ff14]/30 outline-none"
                            placeholder="e.g. axios, fs-extra, lodash"
                        />
                    </div>
                </div>

                <div className="p-6 bg-black/20 flex flex-col">
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                        <Terminal size={12} /> Remote Hardware Output
                    </label>
                    <div className="flex-1 rounded-2xl bg-black border border-white/5 p-4 font-mono text-[10px] overflow-auto min-h-[150px]">
                        {loading && (
                            <div className="text-[#39ff14] animate-pulse">
                                [INFO] Deploying environment to Node...<br />
                                [INFO] Installing requirements...<br />
                                [INFO] Accessing local RAM...
                            </div>
                        )}
                        {output && (
                            <div className="space-y-2">
                                <div className="text-gray-500">Execution duration: <span className="text-[#39ff14]">{output.duration}s</span></div>
                                {output.stdout && (
                                    <div className="text-white whitespace-pre-wrap">{output.stdout}</div>
                                )}
                                {output.stderr && (
                                    <div className="text-red-400 whitespace-pre-wrap">ERROR: {output.stderr}</div>
                                )}
                                {output.error && (
                                    <div className="text-red-500 font-bold">CRITICAL: {output.error}</div>
                                )}
                            </div>
                        )}
                        {!loading && !output && (
                            <div className="text-gray-700 italic">No output received. Ready for deployment...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScriptRunner;
