import { motion } from "framer-motion";
import { animations } from "../../../utils/animations";
import { useContext } from "react";
import { AllConvoContext } from "@/context/AllConvoProvider";
// TODO: move animation type up,
// there's no need to get it in message and in this component
export default function MonthAndYear({ createdAt }: { createdAt: string }) {
  // const { handleRemoveMessage, animationType } =
  //   useContext(AllConvoContext).convoContext;
  const createdAtDate = new Date(createdAt);
  const isSameYear = createdAtDate.getFullYear() === new Date().getFullYear();
  const dateString = createdAtDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    ...(isSameYear ? {} : { year: "numeric" }),
  });
  const animationProps = {
    initial: animations["disableAnimation"]?.initial,
    animate: animations["disableAnimation"]?.animate,
    exit: animations["disableAnimation"]?.exit,
    transition: animations["disableAnimation"]?.transition,
  };

  // TODO:CSS move this margin up

  return (
    <motion.div className="w-fit mx-auto mt-10" {...animationProps}>
      <p>{dateString}</p>
    </motion.div>
  );
}
