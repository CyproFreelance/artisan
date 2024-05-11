'use client'
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingScreen = ({ setLoading } : any) => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const animateLoading = async () => {
      await controls.start({ rotate: 90 });
      await controls.start({ rotate: 180 });
      await controls.start({ rotate: 270 });
      await controls.start({ rotate: 360 });
      setLoadingComplete(true);
      setLoading(false); // Notify parent component that loading is complete
    };

    animateLoading();
  }, [controls, setLoading]);

  return (
    <motion.div
      className="bg-zinc-950 fixed top-0 left-0 w-10 h-10 flex justify-center items-center"
      initial={{ scale: 0.5 }}
      animate={loadingComplete ? { scale: 1 } : {}}
      transition={{ duration: 1 }}
    >
    </motion.div>
  );
};

export default LoadingScreen;