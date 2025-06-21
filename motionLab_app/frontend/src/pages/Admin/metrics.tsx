import { useState, useEffect } from "react";
import { getSystemMetrics } from "@/api/adminAPIs";
import { SystemMetrics as SystemMetricsType } from "@/api/adminAPIs";

// Enhanced Chart component for visualizing data
const Chart = ({ 
  data, 
  labels, 
  height = "h-64",
  color = "purple" 
}: { 
  data: number[];
  labels?: string[];
  height?: string;
  color?: "purple" | "blue" | "green" | "red" | "yellow" 
}) => {
    // State for tooltip
    const [tooltip, setTooltip] = useState<{ show: boolean, index: number, value: number }>({
        show: false,
        index: 0,
        value: 0
    });
    
    // State to track which bar is being hovered
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
    
    // Calculate the max value to normalize the bars
    const maxValue = Math.max(...data, 1); // Ensure we don't divide by zero
    const colorMap = {
        purple: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
        blue: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
        green: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
        red: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
        yellow: "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700"
    };
    
    const colorClass = colorMap[color];
    
    // Handle mouse enter for data point
    const handleMouseEnter = (index: number, value: number) => {
        setTooltip({
            show: true,
            index,
            value
        });
        setHoveredPoint(index);
    };
    
    // Handle mouse leave for data point
    const handleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, show: false }));
        setHoveredPoint(null);
    };
    
    return (
        <div className={`${height} bg-gradient-to-br from-gray-800/90 to-gray-800/70 rounded-xl p-4 shadow-xl overflow-hidden relative border border-gray-700/50`}>
            <div className="flex justify-between mb-4">
                <h4 className="text-white font-medium">Chart</h4>
                <span className="text-gray-400 text-sm">{data.length} data points</span>
            </div>
            
            {/* Tooltip */}
            {tooltip.show && (
                <div className="absolute z-20 bg-gray-900/90 backdrop-blur-sm text-white text-xs p-2 rounded shadow-lg pointer-events-none border border-gray-700"
                    style={{ 
                        top: '10px',
                        right: '10px'
                    }}
                >
                    <div className="font-bold text-sm mb-1" style={{
                        color: color === "purple" ? "#c4b5fd" : 
                               color === "blue" ? "#93c5fd" : 
                               color === "green" ? "#6ee7b7" : 
                               color === "red" ? "#fca5a5" : "#fde68a"
                    }}>
                        {labels ? labels[tooltip.index] : `Point ${tooltip.index + 1}`}
                    </div>
                    <div>Value: <span className="font-semibold">{tooltip.value}%</span></div>
                </div>
            )}
            
            {/* Grid lines for better readability */}
            <div className="relative h-[calc(100%-40px)]">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 50, 100].map((percent) => (
                        <div key={percent} className="w-full h-px bg-gray-700 opacity-50">
                            <span className="absolute -left-1 -translate-y-1/2 text-xs text-gray-500">{percent}%</span>
                        </div>
                    ))}
                </div>
                
                {/* Bar chart */}
                <div className="absolute inset-0 flex items-end px-1">
                    {data.map((value, index) => {
                        const heightPercent = (value / maxValue) * 100;
                        const isHovered = hoveredPoint === index;
                        
                        return (
                            <div 
                                key={index} 
                                className="flex-1 flex flex-col items-center justify-end h-full"
                                title={`${labels ? labels[index] : index}: ${value}%`}
                                onMouseEnter={() => handleMouseEnter(index, value)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div 
                                    className={`${colorClass} rounded-t-md transition-all duration-300`}
                                    style={{ 
                                        height: `${heightPercent}%`,
                                        minHeight: value > 0 ? '4px' : '0', // Ensure even small values are visible
                                        width: isHovered ? '80%' : '60%',
                                        maxWidth: '24px',
                                        transition: 'all 0.2s ease'
                                    }}
                                ></div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* X-axis labels */}
            <div className="mt-2 flex justify-between overflow-hidden">
                {labels && labels.length > 0 && (
                    <>
                        {/* Show first label */}
                        <span className="text-xs text-gray-400 truncate">{labels[0]}</span>
                        
                        {/* Show middle labels based on available space */}
                        {labels.length > 8 ? (
                            // For many points, show a subset of labels
                            <>
                                {[0.25, 0.5, 0.75].map((fraction) => {
                                    const index = Math.floor(labels.length * fraction);
                                    return (
                                        <span key={index} className="text-xs text-gray-400 truncate">
                                            {labels[index]}
                                        </span>
                                    );
                                })}
                            </>
                        ) : (
                            // For fewer points, show more labels
                            <>
                                {labels.slice(1, -1).map((label, index) => (
                                    <span key={index} className="text-xs text-gray-400 truncate">
                                        {label}
                                    </span>
                                ))}
                            </>
                        )}
                        
                        {/* Show last label */}
                        <span className="text-xs text-gray-400 truncate">{labels[labels.length - 1]}</span>
                    </>
                )}
            </div>
        </div>
    );
};

const SystemMetricsPage = () => {
    const [timeRange, setTimeRange] = useState("day");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<SystemMetricsType | null>(null);
    const [usingMockData, setUsingMockData] = useState(false);
    const [usingRealTimeMetrics, setUsingRealTimeMetrics] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(false);

    // Fetch metrics when time range changes or manual refresh
    useEffect(() => {
        fetchMetrics();

        // Set up auto-refresh if enabled
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchMetrics();
            }, 5000); // Refresh every 5 seconds
            setRefreshInterval(interval);
        } else if (refreshInterval) {
            // Clear interval if auto-refresh is disabled
            clearInterval(refreshInterval);
            setRefreshInterval(null);
        }

        // Cleanup function
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, [timeRange, autoRefresh]);

    const fetchMetrics = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSystemMetrics(timeRange);
            if (response.success && response.data) {
                setMetrics(response.data);
                // Check response message to determine data source
                if (response.message && response.message.includes("real-time")) {
                    setUsingRealTimeMetrics(true);
                    setUsingMockData(false);
                } else if (response.message && (response.message.includes("mock") || response.message.includes("development"))) {
                    setUsingMockData(true);
                    setUsingRealTimeMetrics(false);
                } else {
                    setUsingMockData(false);
                    setUsingRealTimeMetrics(false);
                }
            } else {
                setError(response.message || "Failed to fetch system metrics");
            }
        } catch (error) {
            console.error("Error fetching system metrics:", error);
            setError("An unexpected error occurred while fetching metrics");
        } finally {
            setLoading(false);
        }
    };

    const handleTimeRangeChange = (range: string) => {
        setTimeRange(range);
    };

    const toggleAutoRefresh = () => {
        setAutoRefresh(!autoRefresh);
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-900 min-h-screen">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={fetchMetrics} 
                        className="mt-4 px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-100 transition shadow-md"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="p-6 bg-gray-900 min-h-screen">
                <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-2">No Data</h2>
                    <p>No system metrics data available for the selected time range.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">System Metrics</h1>
                <div className="flex space-x-3">
                    <button 
                        onClick={fetchMetrics}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition shadow-md flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                    <button 
                        onClick={toggleAutoRefresh}
                        className={`px-4 py-2 rounded-lg transition shadow-md flex items-center gap-2 ${
                            autoRefresh 
                                ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800" 
                                : "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700"
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {autoRefresh ? "Auto-Refresh: ON" : "Auto-Refresh: OFF"}
                    </button>
                </div>
            </div>
            
            {usingRealTimeMetrics && (
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg mb-6 shadow-lg flex justify-between items-center">
                    <div>
                        <span className="font-bold">Real-Time Metrics</span> - Using metrics from the local system
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${autoRefresh ? "animate-pulse bg-white" : "bg-gray-300"}`}></span>
                        <span className="text-sm">{autoRefresh ? "Live" : "Static"}</span>
                    </div>
                </div>
            )}
            
            {usingMockData && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-lg mb-6 shadow-lg flex justify-between items-center">
                    <div>
                        <span className="font-bold">Development Mode</span> - Using mock data. System metrics not available.
                    </div>
                    <button 
                        onClick={fetchMetrics}
                        className="px-3 py-1 bg-white text-amber-600 rounded hover:bg-gray-100 transition shadow-md"
                    >
                        Try Again
                    </button>
                </div>
            )}
            
            <div className="flex justify-end mb-6">
                <div className="inline-flex rounded-md shadow-md">
                    <button 
                        onClick={() => handleTimeRangeChange("day")}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${timeRange === "day" 
                            ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" 
                            : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700"}`}
                    >
                        Day
                    </button>
                    <button 
                        onClick={() => handleTimeRangeChange("week")}
                        className={`px-4 py-2 text-sm font-medium border-l border-r border-gray-600 ${timeRange === "week" 
                            ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" 
                            : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700"}`}
                    >
                        Week
                    </button>
                    <button 
                        onClick={() => handleTimeRangeChange("month")}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${timeRange === "month" 
                            ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white" 
                            : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700"}`}
                    >
                        Month
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">CPU Usage</h3>
                    <div className="flex items-center">
                        <p className="text-white text-2xl font-bold">{Math.round(metrics.cpu[metrics.cpu.length - 1])}%</p>
                        <div className="w-full ml-4 bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full" style={{width: `${Math.round(metrics.cpu[metrics.cpu.length - 1])}%`}}></div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">Memory Usage</h3>
                    <div className="flex items-center">
                        <p className="text-white text-2xl font-bold">{Math.round(metrics.memory[metrics.memory.length - 1])}%</p>
                        <div className="w-full ml-4 bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full" style={{width: `${Math.round(metrics.memory[metrics.memory.length - 1])}%`}}></div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">Disk Usage</h3>
                    <div className="flex items-center">
                        <p className="text-white text-2xl font-bold">{metrics.diskUsage}%</p>
                        <div className="w-full ml-4 bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full" style={{width: `${metrics.diskUsage}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">Average Processing Time</h3>
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-white text-xl font-bold">{metrics.avgProcessTime}</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">Error Rate</h3>
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-white text-xl font-bold">
                            {Math.round(metrics.errorRate[metrics.errorRate.length - 1])}% 
                            <span className="text-gray-400 text-sm ml-2">last {timeRange}</span>
                        </p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">Current Time Range</h3>
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-white text-xl font-bold capitalize">{timeRange}</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700/50">
                    <h3 className="text-white text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">CPU Usage Over Time</h3>
                    <Chart 
                        data={metrics.cpu} 
                        labels={metrics.labels} 
                        color="blue"
                        height="h-64"
                    />
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700/50">
                    <h3 className="text-white text-lg font-semibold mb-4 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Memory Usage Over Time</h3>
                    <Chart 
                        data={metrics.memory} 
                        labels={metrics.labels} 
                        color="green"
                        height="h-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700/50">
                    <h3 className="text-white text-lg font-semibold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Processing History</h3>
                    <Chart 
                        data={metrics.processingHistory} 
                        labels={metrics.labels} 
                        color="purple"
                        height="h-64"
                    />
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700/50">
                    <h3 className="text-white text-lg font-semibold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Error Rate</h3>
                    <Chart 
                        data={metrics.errorRate} 
                        labels={metrics.labels} 
                        color="red"
                        height="h-64"
                    />
                </div>
            </div>
        </div>
    );
};

export default SystemMetricsPage; 