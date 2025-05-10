import React, { useEffect } from "react";
import { ProjectSettings } from "@/types/types";

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
        <div className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col justify-center items-center gap-y-4 bg-gray-800 shadow-md p-6 rounded-md">
                <h2 className="font-bold text-white text-xl">Settings</h2>
                <div className="flex flex-col gap-y-4 w-full">

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
                        <p className="ml-6 text-gray-400 text-xs">
                            When enabled, the animation will stay centered in place instead of following the detected person's movement. This is useful for keeping the animation in a fixed position regardless of how the person moves in the video.
                        </p>
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
                        <p className="text-gray-400 text-xs">
                            Controls how much the animation follows horizontal movement. Higher values make the animation more responsive to left and right motion.
                        </p>
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
                        <p className="text-gray-400 text-xs">
                            Controls how much the animation follows vertical movement. Higher values make the animation more responsive to up and down motion.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default UploadVideoSettingsSection;
