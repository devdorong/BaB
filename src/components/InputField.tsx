import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}) => {
  return (
    <div className="flex flex-col items-start gap-[9px] w-[509px] h-[75px]">
      <label className="flex items-center gap-1 text-gray-700 font-medium">
        {label}
        {required && <span className="text-bab-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full h-[40px] border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-bab-500"
      />
    </div>
  );
};

export default InputField;
