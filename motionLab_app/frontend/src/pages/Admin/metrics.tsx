import React, { useState, useEffect } from "react";
import { getSystemMetrics } from "@/api/adminAPIs";
import { SystemMetrics as SystemMetricsType } from "@/api/adminAPIs";

// Chart component for visualizing data
const Chart = ({ type, data, labels, height = "h-64" }: { type: string; data: number[]; labels?: string[]; height?: string }) => {
    // Calculate the max value to normalize the bars
    const maxValue = Math.max(...data, 1); // Ensure we don't divide by zero
    
    return (
        <div className={`${height} bg-gray-700 rounded-lg p-4`}>
            <div className="flex justify-between mb-2">
                <h4 className="text-white">{type} Chart</h4>
                <span className="text-gray-400 text-sm">{data.length} data points</span>
            </div>
            
            {type === "line" ? (
                <div className="relative h-full">
                    <div className="absolute bottom-0 left-0 right-0 h-[calc(100%-30px)] flex items-end">
                        {data.map((value, index) => {
                            const height = (value / maxValue) * 100;
                            return (
                                <div key={index} className="flex-1 mx-0.5 flex flex-col items-center">
                                    <div 
                                        className="w-full bg-purple-500 rounded-sm" 
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    {labels && <span className="text-xs text-gray-400 mt-1 truncate w-full text-center">{labels[index]}</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex h-full items-end justify-around">
                    {data.map((value, index) => {
                        const height = (value / maxValue) * 100;
                        return (
                            <div key={index} className="w-8 flex flex-col items-center">
                                <div 
                                    className="w-full bg-blue-500 rounded-t-sm" 
                                    style={{ height: `${height}%` }}
                                ></div>
                                <span className="text-xs text-gray-400 mt-1">{labels ? labels[index] : index + 1}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const SystemMetricsPage = () => {
    const [timeRange, setTimeRange] = useState("day");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<SystemMetricsType | null>(null);
    const [usingMockData, setUsingMockData] = useState(false);

    // Fetch metrics when time range changes
    useEffect(() => {
        fetchMetrics();
    }, [timeRange]);

    const fetchMetrics = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSystemMetrics(timeRange);
            if (response.success && response.data) {
                setMetrics(response.data);
                // Check if the response message indicates mock data
                if (response.message && (response.message.includes("mock") || response.message.includes("development"))) {
                    setUsingMockData(true);
                } else {
                    setUsingMockData(false);
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

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-600 text-white p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={fetchMetrics} 
                        className="mt-4 px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-100 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="p-6">
                <div className="bg-yellow-600 text-white p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">No Data</h2>
                    <p>No system metrics data available for the selected time range.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">System Metrics</h1>
            
            {usingMockData && (
                <div className="bg-amber-600 text-white p-3 rounded-lg mb-4 flex justify-between items-center">
                    <div>
                        <span className="font-bold">Development Mode</span> - Using mock data. Backend API not available.
                    </div>
                    <button 
                        onClick={fetchMetrics}
                        className="px-3 py-1 bg-white text-amber-600 rounded hover:bg-gray-100"
                    >
                        Retry API
                    </button>
                </div>
            )}
            
            <div className="flex justify-end mb-4">
                <div className="inline-flex rounded-md shadow-sm">
                    <button 
                        onClick={() => handleTimeRangeChange("day")}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${timeRange === "day" 
                            ? "bg-purple-600 text-white" 
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                    >
                        Day
                    </button>
                    <button 
                        onClick={() => handleTimeRangeChange("week")}
                        className={`px-4 py-2 text-sm font-medium ${timeRange === "week" 
                            ? "bg-purple-600 text-white" 
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                    >
                        Week
                    </button>
                    <button 
                        onClick={() => handleTimeRangeChange("month")}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${timeRange === "month" 
                            ? "bg-purple-600 text-white" 
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                    >
                        Month
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">CPU Usage</h3>
                    <div className="flex items-center">
                        <p className="text-white text-2xl font-bold">{Math.round(metrics.cpu[metrics.cpu.length - 1])}%</p>
                        <div className="w-full ml-4 bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${Math.round(metrics.cpu[metrics.cpu.length - 1])}%`}}></div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">Memory Usage</h3>
                    <div className="flex items-center">
                        <p className="text-white text-2xl font-bold">{Math.round(metrics.memory[metrics.memory.length - 1])}%</p>
                        <div className="w-full ml-4 bg-gray-700 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${Math.round(metrics.memory[metrics.memory.length - 1])}%`}}></div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">Disk Usage</h3>
                    <div className="flex items-center">
                        <p className="text-white text-2xl font-bold">{metrics.diskUsage}%</p>
                        <div className="w-full ml-4 bg-gray-700 rounded-full h-2.5">
                            <div className="bg-purple-500 h-2.5 rounded-full" style={{width: `${metrics.diskUsage}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">Average Processing Time</h3>
                    <p className="text-white text-xl font-bold">{metrics.avgProcessTime}</p>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">Error Rate</h3>
                    <p className="text-white text-xl font-bold">
                        {Math.round(metrics.errorRate[metrics.errorRate.length - 1])}% 
                        <span className="text-gray-400 text-sm ml-2">last {timeRange}</span>
                    </p>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-4">
                    <h3 className="text-gray-400 mb-1 text-sm font-medium">Time Range</h3>
                    <p className="text-white text-xl font-bold">{timeRange}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">CPU Usage Over Time</h3>
                    <Chart type="line" data={metrics.cpu} labels={metrics.labels} />
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Memory Usage Over Time</h3>
                    <Chart type="line" data={metrics.memory} labels={metrics.labels} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Processing History</h3>
                    <Chart type="bar" data={metrics.processingHistory} labels={metrics.labels} />
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Error Rate</h3>
                    <Chart type="line" data={metrics.errorRate} labels={metrics.labels} />
                </div>
            </div>
        </div>
    );
};

export default SystemMetricsPage; 