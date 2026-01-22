import React, { useEffect, useState, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import io from 'socket.io-client';

interface LogEntry {
    id: string;
    msg: string;
    type: 'SYSTEM' | 'BLOCKCHAIN' | 'SECURITY' | 'AGENT';
    timestamp: string;
}

const SystemTerminal: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        const addLog = (msg: string, type: LogEntry['type']) => {
            const entry: LogEntry = {
                id: Math.random().toString(36).substr(2, 9),
                msg,
                type,
                timestamp: new Date().toLocaleTimeString()
            };
            setLogs(prev => [...prev, entry].slice(-50));
        };

        addLog('ANCHOR_CORE_OS initialized. Kernel synced.', 'SYSTEM');
        addLog('BlockNet ledger verification active.', 'BLOCKCHAIN');

        socket.on('global_network_update', (data) => {
            addLog(`Telemetric pulse from Node: ${data.nodeId}`, 'AGENT');
        });

        socket.on('task_updated', (task) => {
            addLog(`Task ${task.name} status updated: ${task.status}`, 'SYSTEM');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-black/80 border border-white/10 rounded-3xl p-6 h-full font-mono relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#39ff14]/5 blur-3xl rounded-full" />

            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                    <TerminalIcon size={14} className="text-[#39ff14]" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live_System_Output</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                </div>
            </div>

            <div
                ref={scrollRef}
                className="space-y-1.5 h-[300px] overflow-y-auto scrollbar-hide text-[10px]"
            >
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 hover:bg-white/5 transition-colors p-0.5 rounded">
                        <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                        <span className={`font-bold shrink-0 ${log.type === 'BLOCKCHAIN' ? 'text-blue-400' :
                            log.type === 'SECURITY' ? 'text-red-400' :
                                log.type === 'AGENT' ? 'text-purple-400' :
                                    'text-[#39ff14]'
                            }`}>[{log.type}]</span>
                        <span className="text-gray-300 break-all">{log.msg}</span>
                    </div>
                ))}
                <div className="inline-flex items-center gap-2 text-[#39ff14] animate-pulse">
                    <span className="w-1 h-3 bg-[#39ff14] shadow-[0_0_10px_#39ff14]" />
                    <span className="uppercase text-[8px] font-bold">Awaiting Ingress...</span>
                </div>
            </div>
        </div>
    );
};

export default SystemTerminal;
