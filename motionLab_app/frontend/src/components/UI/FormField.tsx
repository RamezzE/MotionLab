import React from "react";

interface FormFieldProps {
    label: string;
    id: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    extraStyles?: string;
    disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    id,
    type = "text",
    placeholder = "",
    value,
    onChange,
    extraStyles = "",
    disabled = false,
}) => {
    return (
        <div>
            <label className="block mb-2 font-medium text-sm" htmlFor={id}>
                {label}
            </label>
            {type === "textarea" ? (
                <textarea
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    rows={5}
                    value={value}
                    onChange={onChange}
                    className={`bg-gray-800 px-4 py-3 rounded-md focus:ring-2 focus:ring-purple-600 w-full text-white placeholder-gray-300 focus:outline-none ${extraStyles}`}
                    disabled={disabled}
                ></textarea>
            ) : (
                <input
                    type={type}
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`bg-gray-800 px-4 py-3 rounded-md focus:ring-2 focus:ring-purple-600 w-full text-white placeholder-gray-300 focus:outline-none ${extraStyles}`}
                    disabled={disabled}
                />
            )}
        </div>
    );
};

export default FormField;
