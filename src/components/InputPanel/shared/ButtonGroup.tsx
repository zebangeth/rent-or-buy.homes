interface ButtonGroupOption<T> {
  value: T;
  label: string;
}

interface ButtonGroupProps<T> {
  options: ButtonGroupOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  buttonClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export default function ButtonGroup<T extends string | number>({
  options,
  value,
  onChange,
  className = "grid gap-2",
  buttonClassName = "p-2 rounded-lg text-sm font-medium transition-colors",
  activeClassName = "bg-primary-500 text-white",
  inactiveClassName = "bg-gray-100 text-dark-500 hover:bg-gray-200",
}: ButtonGroupProps<T>) {
  return (
    <div className={className}>
      {options.map((option) => (
        <button
          key={String(option.value)}
          onClick={() => onChange(option.value)}
          className={`${buttonClassName} ${
            value === option.value ? activeClassName : inactiveClassName
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}