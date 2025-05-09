import { FC, ButtonHTMLAttributes, MouseEvent } from "react";
import LoadingSpinner from "./LoadingSpinner"; // Adjust the path as needed

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    loading?: boolean;
    theme?: "default" | "transparent" | "dark"; // Added dark theme option
    fullWidth?: boolean; // New prop to control full width
    textSize?: "sm" | "md" | "base" | "lg"; // New prop for text size, defaults to 'lg'
    extraStyles?: string; // New prop to accept additional custom Tailwind classes
}

const FormButton: FC<FormButtonProps> = ({
    label,
    className,
    loading,
    theme = "default", // Default theme is "default"
    fullWidth = true, // Default to full width
    textSize = "lg", // Default text size is "lg"
    extraStyles = "", // Default to empty string for additional custom classes
    onClick,
    ...props
}) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (loading) return;

        if (onClick) {
            onClick(e);
        }
    };

    // Define styles based on theme prop
    const buttonStyles =
        theme === "transparent"
            ? "text-white hover:text-purple-400 transition duration-300"
            : theme === "dark"
                ? "bg-black/50 hover:bg-black/60 transition duration-300 px-4 py-2 rounded-md text-white/85 hover:text-white"
                : "bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white transition duration-300";

    // Handle text size
    const textStyles =
        textSize === "sm" ? "text-sm" :
            textSize === "md" ? "text-md" :
                textSize === "base" ? "text-base" :
                    "text-lg"; // Default to "text-lg" if no match

    return (
        <button
            {...props}
            onClick={handleClick}
            disabled={loading || props.disabled}
            className={`${fullWidth ? "w-full" : "w-max"} ${buttonStyles} ${textStyles} ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className} ${extraStyles} whitespace-nowrap`}
        >
            {loading ? (
                <div className="flex justify-center items-center w-full">
                    <LoadingSpinner size={32} extraStyles="" />
                </div>
            ) : (
                label
            )}
        </button>
    );
};

export default FormButton;
