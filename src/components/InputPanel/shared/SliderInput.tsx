interface SliderInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;  
  step: number;
  minLabel: string;
  maxLabel: string;
  className?: string;
  disabled?: boolean;
}

export default function SliderInput({
  value,
  onChange,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  className = "custom-range",
  disabled = false,
}: SliderInputProps) {
  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        className={`${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      />
      <div className="flex justify-between text-xs text-dark-400 mt-1">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </>
  );
}