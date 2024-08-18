import { motion } from "framer-motion";
export default function Badge({ caption }) {
  //if we use key frames one after another in array form in animation, we don't need initial frame
  return <motion.span animate={{scale : [1,1.2,1]}} transition={{ duration: 0.3}} className="badge">{caption}</motion.span>;
}
