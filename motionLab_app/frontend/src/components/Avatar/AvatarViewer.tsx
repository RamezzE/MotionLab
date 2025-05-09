import { Avatar } from '@readyplayerme/visage';
import { Vector3 } from 'three';
import { FiTrash } from 'react-icons/fi'; // Import icons from react-icons

interface AvatarViewerProps {
    modelSrc: string;
    characterName: string;
    createdDate: string; // formatted as a string (e.g., '2025-05-08')
    displayMode?: 'default' | 'list'; // New prop to determine the layout
    onPress?: () => void; // Edit handler
    onDelete?: () => void; // Delete handler
}

const AvatarViewer: React.FC<AvatarViewerProps> = ({
    modelSrc,
    characterName,
    createdDate,
    displayMode = 'default', // Default value is 'default'
    onPress,
    onDelete,
}) => {
    // Conditional classes for 'default' and 'list' display modes
    const containerClasses = displayMode === 'list'
        ? 'flex-row gap-x-4 max-w-[300px] hover:border-4 hover:border-blue-500 transition-all duration-300 relative cursor-pointer'  // Horizontal layout for list mode
        : 'flex-col justify-center w-full h-[50vh] xs:flex-row lg:flex-row'; // Flex-col for xs, flex-row for larger screens

    // Handle click event for pressable container in list mode
    const handleContainerClick = () => {
        if (onPress) {
            onPress(); // Trigger onPress if available
        }
    };

    return (
        <div
            className={`flex bg-black/50 px-4 rounded-xl items-center hover:pointer ${containerClasses}`}
            onClick={displayMode === 'list' ? handleContainerClick : undefined} // Only make it clickable in list mode
        >
            {/* Displaying the character name and created date */}
            <div className={displayMode === 'list' ? 'text-left' : 'mt-4 text-left xs:w-[50%]'}>
                <h2 className={`font-semibold text-white text-2xl ${displayMode === 'list' ? 'mb-2' : ''}`}>
                    {characterName}
                </h2>
                <p className="text-gray-400 text-sm">
                    Created on: {new Date(createdDate).toLocaleDateString()}
                </p>
            </div>

            <div className={displayMode === 'list' ? 'w-[150px]' : 'xs:w-[50%] lg:w-[50%] h-full'}>
                {/* Rendering the character model */}
                <Avatar
                    modelSrc={modelSrc}
                    shadows={displayMode === 'default'} // Enable shadows for better depth in default mode
                    cameraZoomTarget={new Vector3(0, 0.1, 0)} // Center the camera on the model
                />
            </div>

            {/* Delete Icon for list view */}
            {displayMode === 'list' && (
                <div className="top-2 right-2 absolute flex gap-2">
                    <button
                        onClick={onDelete}
                        className="text-white hover:text-red-500 hover:cursor-pointer"
                        aria-label="Delete Avatar"
                    >
                        <FiTrash size={24} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AvatarViewer;
