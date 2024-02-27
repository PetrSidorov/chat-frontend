import { motion } from "framer-motion";
import { animations } from "../../../utils/animations";

export default function MonthAndYear({ createdAt }: { createdAt: string }) {
  const createdAtDate = new Date(createdAt);
  const isSameYear = createdAtDate.getFullYear() === new Date().getFullYear();

  const dateString = createdAtDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    ...(isSameYear ? {} : { year: "numeric" }),
  });

  return (
    <motion.div
      className="w-fit mx-auto"
      layout
      initial={animations["enter"].initial}
      animate={animations["enter"].animate}
      exit={animations["enter"].exit}
      transition={animations["enter"].transition}
    >
      <p>{dateString}</p>
    </motion.div>
  );
}
