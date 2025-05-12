import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder = "Select an option",
    disabled = false,
    className = "",
}) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-white">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`bg-black/50 p-2 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
                    ${className}
                    [&>option]:bg-[#10071b] [&>option]:text-white
                `}
            >
                <option value="" className="bg-[#10071b] text-white">{placeholder}</option>
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        style={{ backgroundColor: '#10071b', color: 'white' }}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormSelect; 