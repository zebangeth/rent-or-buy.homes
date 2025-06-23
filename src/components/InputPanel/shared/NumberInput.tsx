interface NumberInputProps {
  value: string | number;
  onChange: (value: string) => void;
  onBlur: () => void;
  className?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: string;
  max?: string;
  step?: string;
  disabled?: boolean;
}

export default function NumberInput({
  value,
  onChange,
  onBlur,
  className = "",
  placeholder,
  prefix,
  suffix,
  min,
  max,
  step,
  disabled = false,
}: NumberInputProps) {
  const baseClassName = "px-2 py-1 text-sm font-semibold border rounded-lg focus:outline-none focus:ring-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  
  return (
    <div className="flex items-center space-x-2">
      {prefix && <span className="text-xs text-dark-500">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`${baseClassName} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
      {suffix && <span className="text-xs text-dark-500">{suffix}</span>}
    </div>
  );
}