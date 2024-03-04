import { ChangeEventHandler } from "react";

export default function LoginFormField({
  value,
  handleChange,
  placeholder,
  name,
  type,
}: {
  value: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  name: string;
  type: string;
}) {
  return (
    <div className="mb-6">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {placeholder}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3
    text-gray-700 leading-tight focus:outline-none
    focus:shadow-outline"
        id={name}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
