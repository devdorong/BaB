import React, { Children } from 'react';
import { ButtonFillLG } from '../ui/button';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}) => {
  return (
    <div className="flex flex-col items-start gap-[9px] w-full h-[83px]">
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
        style={{ height: '50px', boxSizing: 'border-box' }}
        className="w-full border border-gray-300 rounded-[25px] px-3 focus:outline-none focus:ring-2 focus:ring-bab-500"
      />
    </div>
  );
};
interface InputFieldWithButtonProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  children?: React.ReactNode;
}

export const InputFieldWithButton: React.FC<InputFieldWithButtonProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  children,
  required = false,
}) => {
  return (
    <div className="flex flex-col items-start gap-[9px] w-full h-[83px]">
      <label className="flex items-center gap-1 text-gray-700 font-medium">
        {label}
        {required && <span className="text-bab-500">*</span>}
      </label>
      <div className="flex w-full gap-4 ">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{ height: '50px', boxSizing: 'border-box' }}
          className="flex-1 h-[50px] border border-gray-300 rounded-[25px] px-3 focus:outline-none focus:ring-2 focus:ring-bab-500 box-border"
        />
        <ButtonFillLG style={{ minWidth: 125 }} type="button">
          {children}
        </ButtonFillLG>
      </div>
    </div>
  );
};
