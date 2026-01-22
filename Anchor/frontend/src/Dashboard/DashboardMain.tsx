import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Overview from './Overview';
import WebSocketManager from './WebSocketManager';
import AnchorNodes from './AnchorNodes';
import ResourceMarketplace from './ResourceMarketplace';
import Billing from './Billing';
import Monitoring from './Monitoring';
import SystemSettings from './SystemSettings';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardMainProps {
    onLogout: () => void;
    user: any;
}

const DashboardMain: React.FC<DashboardMainProps> = ({ onLogout, user }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview />;
            case 'websockets':
                return <WebSocketManager />;
            case 'nodes':
                return <AnchorNodes />;
            case 'Marketplace':
                return <ResourceMarketplace />;
            case 'Monitoring':
                return <Monitoring />;
            case 'Billing':
                return <Billing />;
            case 'settings':
                return <SystemSettings />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="flex h-screen bg-black overflow-hidden font-sans selection:bg-[#39ff14] selection:text-black">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopBar />

                <main className="flex-1 overflow-y-auto scrollbar-hide">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="min-h-full"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default DashboardMain;
