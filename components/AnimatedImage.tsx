"use client";

import React from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface AnimatedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(
    useTransform(y, [-300, 300], [5, -5]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(x, [-300, 300], [-5, 5]),
    springConfig
  );

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
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={{
            boxShadow: "0 4px 200px rgba(190, 24, 93, 0.5)",
            width: "100%",
            height: "auto",
          }}
          priority
        />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedImage;
