import { ChangeEventHandler } from "react";
import { motion } from "framer-motion";
export default function LoginFormField({
  value,
  handleChange,
  placeholder,
  name,
  animations,
  type,
}: {
  value: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  name: string;
  animations?: boolean;
  type: string;
}) {
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  const animationProps = {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: containerVariants,
    transition: { duration: 0.5, ease: [0.6, -0.28, 0.735, 0.045] },
    key: name,
    ...{ layout: animations },
  };

  const Component = animations ? motion.div : "div";

  return (
    <Component className="mb-6" {...(animations ? animationProps : {})}>
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {placeholder}
      </label>
      <input
        className="shadow appearance-none borderrounded w-full py-2 px-3
    text-gray-700 leading-tight focus:outline-none
    focus:shadow-outline"
        id={name}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleChange}
      />
    </Component>
  );
}
