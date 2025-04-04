import React, { useState, useEffect } from "react";
import { getLogs } from "@/api/adminAPIs";
import { Log } from "@/api/adminAPIs";

const LogsViewer = () => {
    const [logType, setLogType] = useState("all");
    const [logLevel, setLogLevel] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [limit, setLimit] = useState(50);
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalLogs, setTotalLogs] = useState(0);
    const [usingMockData, setUsingMockData] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLogs(logType, logLevel, limit);
            if (response.success && response.data) {
                setLogs(response.data);
                setTotalLogs(response.data.length > totalLogs ? response.data.length : totalLogs);
                // Check if the response message indicates mock data
                if (response.message && (response.message.includes("mock") || response.message.includes("development"))) {
                    setUsingMockData(true);
                } else {
                    setUsingMockData(false);
                }
            } else {
                setError(response.message || "Failed to fetch logs");
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
            setError("An unexpected error occurred while fetching logs");
        } finally {
            setLoading(false);
        }
    };

    // Fetch logs on component mount and when filters change
    useEffect(() => {
        fetchLogs();
    }, [logType, logLevel, limit]);

    const handleLogTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLogType(e.target.value);
    };

    const handleLogLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLogLevel(e.target.value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleLoadMore = () => {
        setLimit(prevLimit => prevLimit + 50);
    };

    const getLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case "error": return "bg-gradient-to-r from-red-500 to-red-600";
            case "warning": return "bg-gradient-to-r from-yellow-500 to-amber-600";
            case "info": return "bg-gradient-to-r from-blue-500 to-blue-600";
            case "debug": return "bg-gradient-to-r from-green-500 to-emerald-600";
            default: return "bg-gradient-to-r from-gray-500 to-gray-600";
        }
    };

    // Filter logs by search query
    const filteredLogs = logs.filter(log => 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.service?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-white bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">System Logs</h1>
            
            {usingMockData && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-lg mb-6 shadow-lg flex justify-between items-center">
                    <div>
                        <span className="font-bold">Development Mode</span> - Using mock data. Backend API not available.
                    </div>
                    <button 
                        onClick={fetchLogs}
                        className="px-3 py-1 bg-white text-amber-600 rounded hover:bg-gray-100 transition shadow-md"
                    >
                        Retry API
                    </button>
                </div>
            )}
            
            {error && (
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg mb-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={fetchLogs} 
                        className="mt-2 px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-100 transition shadow-md"
                    >
                        Retry
                    </button>
                </div>
            )}
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700">
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <select 
                            value={logType}
                            onChange={handleLogTypeChange}
                            className="px-4 py-2 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent shadow-md"
                        >
                            <option value="all">All Services</option>
                            <option value="auth">Auth Service</option>
                            <option value="processor">Processor Service</option>
                            <option value="system">System Service</option>
                            <option value="database">Database Service</option>
                        </select>
                        
                        <select 
                            value={logLevel}
                            onChange={handleLogLevelChange}
                            className="px-4 py-2 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent shadow-md"
                        >
                            <option value="all">All Levels</option>
                            <option value="debug">Debug</option>
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                        </select>
                    </div>
                    
                    <div className="flex-grow md:max-w-md relative">
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search logs..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent shadow-md"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-gray-700/50">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/60 p-4 rounded-t-lg text-white font-mono text-sm">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">
                                {loading ? 'Loading logs...' : `Showing ${filteredLogs.length} logs`}
                            </span>
                            <button className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Logs
                            </button>
                        </div>
                        
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : filteredLogs.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                No logs found matching your criteria
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredLogs.map(log => (
                                    <div key={log.id} className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-gray-400 text-xs">{log.timestamp}</span>
                                            <span className={`px-2 py-0.5 text-xs text-white rounded-full ${getLevelColor(log.level)}`}>
                                                {log.level.toUpperCase()}
                                            </span>
                                            <span className="text-purple-400 font-medium">[{log.service}]</span>
                                        </div>
                                        <div className="pl-4 text-gray-300 break-words">
                                            {log.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/90 to-gray-800/70 p-4 rounded-b-lg border-t border-gray-700/50 flex justify-between items-center">
                        <button 
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-purple-700"
                            onClick={handleLoadMore}
                            disabled={loading || logs.length < limit} // Disable if we've loaded all logs
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            Load More
                        </button>
                        <div className="text-gray-400 text-sm">
                            Showing <span className="text-purple-400 font-medium">{filteredLogs.length}</span> of <span className="text-white">{totalLogs}</span> logs
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogsViewer; 