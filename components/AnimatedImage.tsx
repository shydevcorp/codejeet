"use client";

import React from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({ src, alt, width, height, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(y, [-300, 300], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(x, [-300, 300], [-5, 5]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0, true);
    y.set(0, true);
  };

  return (
    <motion.div
      className="flex justify-center items-center overflow-visible p-0 sm:p-10 w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          width: "100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative w-full">
          <div className="absolute inset-0 bg-primary/50 dark:bg-primary/70 blur-[150px] rounded-full scale-110" />
          <div className="absolute inset-0 bg-primary/30 dark:bg-primary/50 blur-[100px] rounded-full scale-95" />
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn("relative z-10", className)}
            style={{
              width: "100%",
              height: "auto",
            }}
            priority
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedImage;
