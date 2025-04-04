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
            case "error": return "bg-red-500";
            case "warning": return "bg-yellow-500";
            case "info": return "bg-blue-500";
            case "debug": return "bg-green-500";
            default: return "bg-gray-500";
        }
    };

    // Filter logs by search query
    const filteredLogs = logs.filter(log => 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.service?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">System Logs</h1>
            
            {usingMockData && (
                <div className="bg-amber-600 text-white p-3 rounded-lg mb-4 flex justify-between items-center">
                    <div>
                        <span className="font-bold">Development Mode</span> - Using mock data. Backend API not available.
                    </div>
                    <button 
                        onClick={fetchLogs}
                        className="px-3 py-1 bg-white text-amber-600 rounded hover:bg-gray-100"
                    >
                        Retry API
                    </button>
                </div>
            )}
            
            {error && (
                <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={fetchLogs} 
                        className="mt-2 px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-100 transition"
                    >
                        Retry
                    </button>
                </div>
            )}
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <select 
                            value={logType}
                            onChange={handleLogTypeChange}
                            className="px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                            className="px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">All Levels</option>
                            <option value="debug">Debug</option>
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                        </select>
                    </div>
                    
                    <div className="flex-grow md:max-w-md">
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search logs..."
                            className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <div className="bg-gray-700 p-4 rounded-t-lg text-white font-mono text-sm">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">
                                {loading ? 'Loading logs...' : `Showing ${filteredLogs.length} logs`}
                            </span>
                            <button className="text-purple-400 hover:text-purple-300">
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
                                    <div key={log.id} className="p-2 bg-gray-800 rounded">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-gray-400">{log.timestamp}</span>
                                            <span className={`px-2 py-0.5 text-xs text-white rounded ${getLevelColor(log.level)}`}>
                                                {log.level.toUpperCase()}
                                            </span>
                                            <span className="text-purple-400">[{log.service}]</span>
                                        </div>
                                        <div className="pl-4">
                                            {log.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-b-lg border-t border-gray-700 flex justify-between">
                        <button 
                            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleLoadMore}
                            disabled={loading || logs.length < limit} // Disable if we've loaded all logs
                        >
                            Load More
                        </button>
                        <div className="text-gray-400">
                            Showing {filteredLogs.length} of {totalLogs} logs
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogsViewer; 