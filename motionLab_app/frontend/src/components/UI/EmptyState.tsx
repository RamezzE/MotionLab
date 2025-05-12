import React from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
    title, 
    description,
    className = "max-w-sm" // Default max width, can be overridden
}) => {
    return (
        <div className={`bg-black/50 shadow-lg p-6 border border-purple-600 rounded-lg w-full ${className} text-white`}>
            <h2 className="font-bold text-xl">{title}</h2>
            <p className="mt-2 text-gray-400">{description}</p>
        </div>
    );
};

export default EmptyState; 