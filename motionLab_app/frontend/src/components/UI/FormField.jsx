import React from "react";

const FormField = ({ label,
    id,
    type = "text",
    placeholder = "",
    value,
    onChange, }) => {
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
                    className="bg-gray-700 px-4 py-3 rounded-md focus:ring-2 focus:ring-purple-600 w-full text-white placeholder-gray-400 focus:outline-none"
                ></textarea>
            ) : (
                <input
                    type={type}
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="bg-gray-700 px-4 py-3 rounded-md focus:ring-2 focus:ring-purple-600 w-full text-white placeholder-gray-400 focus:outline-none"
                />
            )}
        </div>
    );
}

export default FormField