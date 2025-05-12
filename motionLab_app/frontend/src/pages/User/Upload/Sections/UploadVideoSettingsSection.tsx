import React, { useEffect } from "react";
import { ProjectSettings } from "@/types/types";
import ErrorMessage from "@/components/UI/ErrorMessage";
interface UploadVideoSettingsSectionProps {
    settings: ProjectSettings;
    setSettings: React.Dispatch<React.SetStateAction<ProjectSettings>>;
    error: string | null;
    loading: boolean;
}

const UploadVideoSettingsSection: React.FC<UploadVideoSettingsSectionProps> = ({ settings, setSettings, error, loading }) => {
    const handleStationaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSettings({ ...settings, stationary: true, xSensitivity: 0, ySensitivity: 0 });
        } else {
            setSettings({ ...settings, stationary: false });
        }
    };

    const handleSensitivityChange = (axis: 'x' | 'y', value: number) => {
        if (settings.stationary) {
            setSettings({ ...settings, stationary: false, [`${axis}Sensitivity`]: value });
        } else {
            setSettings({ ...settings, [`${axis}Sensitivity`]: value });
        }
    };

    // Effect to automatically check stationary when both sensitivities are 0
    useEffect(() => {
        if (settings.xSensitivity === 0 && settings.ySensitivity === 0 && !settings.stationary) {
            setSettings(prev => ({ ...prev, stationary: true }));
        }
    }, [settings.xSensitivity, settings.ySensitivity]);

    return (
        <div className="flex flex-col justify-center items-center px-8 w-full text-white">
            <div className="bg-gray-800 shadow-lg p-6 border border-purple-600 rounded-lg w-full max-w-md">
                <h2 className="mb-6 font-bold text-white text-xl text-center">Settings</h2>
                <div className="flex flex-col gap-y-6 w-full">

                    {/* Project Name Input */}
                    <div>
                        <label htmlFor="project-name" className="text-gray-300 text-sm">
                            Project Name
                        </label>
                        <input
                            id="project-name"
                            type="text"
                            className="bg-gray-900 mt-1 px-4 py-2 border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 w-full text-white"
                            placeholder="Enter project name"
                            value={settings.projectName}
                            onChange={(e) => setSettings({ ...settings, projectName: e.target.value })}
                            disabled={loading}
                        />
                        {error && (
                            <ErrorMessage message={error} className="mt-4" />
                        )}
                    </div>

                    {/* Stationary Checkbox */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="stationary"
                                checked={settings.stationary}
                                onChange={handleStationaryChange}
                                disabled={loading}
                                className="bg-gray-900 border-purple-600 rounded focus:ring-purple-500 w-4 h-4 text-purple-600"
                            />
                            <label htmlFor="stationary" className="text-gray-300 text-sm">
                                Stationary
                            </label>
                        </div>
                        <div className="space-y-1 ml-6 text-gray-400 text-xs">
                            <p className="text-yellow-300">
                                Recommended if you plan to use the avatar in an external viewer or game engine to keep its position controlled
                            </p>
                            <p className="font-medium">When enabled:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>The animation stays centered in place</li>
                                <li>Ignores the person's movement in the video</li>
                                <li>Useful for keeping animations in a fixed position</li>

                            </ul>
                        </div>
                    </div>

                    {/* X Sensitivity Slider */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="x-sensitivity" className="text-gray-300 text-sm">
                                X Sensitivity: {settings.xSensitivity}%
                            </label>
                        </div>
                        <input
                            id="x-sensitivity"
                            type="range"
                            min="0"
                            max="100"
                            value={settings.xSensitivity}
                            onChange={(e) => handleSensitivityChange('x', parseInt(e.target.value))}
                            disabled={loading}
                            className="bg-gray-900 rounded-lg w-full h-2 accent-purple-600 appearance-none cursor-pointer"
                        />
                        <div className="space-y-1 text-gray-400 text-xs">
                            <p className="font-medium">Controls horizontal movement:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Higher values = more responsive to left/right motion</li>
                                <li>Lower values = less responsive to horizontal movement</li>
                            </ul>
                            <p className="mt-2 font-medium">For multiple people:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Adjust to prevent animations from overlapping</li>
                                <li>Keep people at a distance in the input video</li>
                                <li>Avoid significant overlap between people</li>
                            </ul>
                        </div>
                    </div>

                    {/* Y Sensitivity Slider */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="y-sensitivity" className="text-gray-300 text-sm">
                                Y Sensitivity: {settings.ySensitivity}%
                            </label>
                        </div>
                        <input
                            id="y-sensitivity"
                            type="range"
                            min="0"
                            max="100"
                            value={settings.ySensitivity}
                            onChange={(e) => handleSensitivityChange('y', parseInt(e.target.value))}
                            disabled={loading}
                            className="bg-gray-900 rounded-lg w-full h-2 accent-purple-600 appearance-none cursor-pointer"
                        />
                        <div className="space-y-1 text-gray-400 text-xs">
                            <p className="font-medium">Controls vertical movement:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Higher values = more responsive to up/down motion</li>
                                <li>Lower values = less responsive to vertical movement</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadVideoSettingsSection;
