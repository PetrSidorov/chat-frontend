import { motion } from "framer-motion";
import { animations } from "../../../utils/animations";

export default function MonthAndYear({
  createdAt,
  animationType,
  shouldAnimate,
}: {
  createdAt: string;
  animationType: string;
  shouldAnimate: boolean;
}) {
  const createdAtDate = new Date(createdAt);
  const isSameYear = createdAtDate.getFullYear() === new Date().getFullYear();
  const dateString = createdAtDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    ...(isSameYear ? {} : { year: "numeric" }),
  });
  const animationProps = shouldAnimate
    ? {
        initial: animations[animationType]?.initial,
        animate: animations[animationType]?.animate,
        exit: animations[animationType]?.exit,
        transition: animations[animationType]?.transition,
      }
    : {};
  // TODO:CSS move this margin up

  return (
    <motion.div className="w-fit mx-auto mt-10" layout {...animationProps}>
      <p>{dateString}</p>
    </motion.div>
  );
}
