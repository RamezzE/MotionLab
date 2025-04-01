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

export default RadioInput;