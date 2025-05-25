import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const FadeInOnView = ({
  children,
  delay = 0,
  yOffset = 0,
  xOffset = 0,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (inView) setHasBeenVisible(true);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xOffset, y: yOffset }}
      animate={hasBeenVisible ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInOnView;
