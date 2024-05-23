import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import VisuallyHidden from "../VisuallyHidden";
import { ComponentProps } from "react";

type CloseXCircleButtonProps = ComponentProps<"button"> & {
  hiddenText: string;
  onClick: () => void;
};

export default function CloseXCircleButton({
  hiddenText,
  onClick,
  ...rest
}: {
  hiddenText: string;
  onClick: () => void;
  rest?: any;
}) {
  return (
    <motion.button
      {...rest}
      onClick={() => onClick()}
      whileHover={{
        scale: 1.1,
        rotate: [0, -5, 5, -5, 5, 0],
        transition: { duration: 1 },
      }}
      whileTap={{ scale: 0.9 }}
    >
      <XCircle />
      <VisuallyHidden>{hiddenText}</VisuallyHidden>
    </motion.button>
  );
}
