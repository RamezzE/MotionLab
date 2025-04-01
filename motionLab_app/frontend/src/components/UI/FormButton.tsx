import { FC, ButtonHTMLAttributes, MouseEvent } from "react";
import LoadingSpinner from "./LoadingSpinner"; // Adjust the path as needed

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    loading?: boolean;
}

const FormButton: FC<FormButtonProps> = ({
    label,
    className,
    loading,
    onClick,
    ...props
}) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (loading) return;

        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button
            {...props}
            onClick={handleClick}
            disabled={loading || props.disabled}
            className={`bg-purple-600 hover:bg-purple-700 px-8 py-2 rounded-md w-full text-white text-lg transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } ${className || ""}`}
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
