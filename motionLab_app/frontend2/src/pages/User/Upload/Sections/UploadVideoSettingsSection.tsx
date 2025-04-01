interface RadioInputProps {
    name: string;
    value: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    disabled: boolean;
}

const RadioInput: React.FC<RadioInputProps> = ({ name, value, checked, onChange, label, disabled }) => {
    return (
        <label className="flex items-center text-gray-300">
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="focus:ring-purple-400 text-purple-600 form-radio"
                disabled={disabled}
            />
            <span className="ml-2">{label}</span>
        </label>
    );
};

interface UploadVideoSettings {
    projectName: string;
    peopleCount: "single" | "multiple";
    outputFormat: "fbx" | "bvh";
}

interface UploadVideoSettingsSectionProps {
    settings: UploadVideoSettings;
    setSettings: React.Dispatch<React.SetStateAction<UploadVideoSettings>>;
    error: string | null;
    loading: boolean;
}

const UploadVideoSettingsSection: React.FC<UploadVideoSettingsSectionProps> = ({ settings, setSettings, error, loading }) => {
    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col justify-center items-center gap-y-4 bg-gray-800 shadow-md p-6 rounded-md">
                <h2 className="font-bold text-white text-xl">Settings</h2>
                <div className="flex flex-col gap-y-4">

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

                    {/* Multiple People or Single Person */}
                    <div>
                        <p className="text-gray-300 text-sm">Number of People:</p>
                        <div className="flex items-center space-x-4 mt-2">
                            <RadioInput
                                name="people-count"
                                value="single"
                                checked={settings.peopleCount === "single"}
                                onChange={() => setSettings({ ...settings, peopleCount: "single" })}
                                label="Single Person"
                                disabled={loading}
                            />
                            <RadioInput
                                name="people-count"
                                value="multiple"
                                checked={settings.peopleCount === "multiple"}
                                onChange={() => setSettings({ ...settings, peopleCount: "multiple" })}
                                label="Multiple People"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Output Format Selection */}
                    <div>
                        <p className="text-gray-300 text-sm">Output Format:</p>
                        <div className="flex items-center space-x-4 mt-2">
                            <RadioInput
                                name="output-format"
                                value="fbx"
                                checked={settings.outputFormat === "fbx"}
                                onChange={() => setSettings({ ...settings, outputFormat: "fbx" })}
                                label="FBX"
                                disabled={loading}
                            />
                            <RadioInput
                                name="output-format"
                                value="bvh"
                                checked={settings.outputFormat === "bvh"}
                                onChange={() => setSettings({ ...settings, outputFormat: "bvh" })}
                                label="BVH"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default UploadVideoSettingsSection;
