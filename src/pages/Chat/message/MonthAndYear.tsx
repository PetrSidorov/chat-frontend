import { motion } from "framer-motion";
import { animations } from "../../../utils/animations";
import { useContext } from "react";
import { AllConvoContext } from "@/context/AllConvoProvider";

export default function MonthAndYear({
  createdAt,
  animationType = "enter",
}: {
  createdAt: string;
  animationType?: string;
}) {
  const createdAtDate = new Date(createdAt);
  const isSameYear = createdAtDate.getFullYear() === new Date().getFullYear();
  const dateString = createdAtDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    ...(isSameYear ? {} : { year: "numeric" }),
  });
  const animationProps = {
    initial: animations[animationType]?.initial,
    animate: animations[animationType]?.animate,
    exit: animations[animationType]?.exit,
    transition: animations[animationType]?.transition,
    layout: true,
  };

  // TODO:CSS move this margin up

  return (
    <motion.div className="w-fit mx-auto mt-10" {...animationProps}>
      <p>{dateString}</p>
    </motion.div>
  );
}
