"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import BlurIn from "@/components/magic-ui/blur-in";
import AnimatedImage from "@/components/AnimatedImage";
import Link from "next/link";
import { DotPattern } from "@/components/magic-ui/dot-pattern";
import { cn } from "@/lib/utils";
import NumberTicker from "@/components/magic-ui/number-ticker";
import { Button } from "@/components/ui/button";
import AnimatedGradientText from "@/components/magic-ui/animated-gradient-text";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className={outfit.className}>
      <main>
        <div ref={containerRef} className="z-0 relative min-h-screen w-full pb-40 overflow-hidden ">
          <motion.div
            className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-4 px-4 pt-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <DotPattern
              className={cn(
                "absolute inset-0 z-0 [mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]"
              )}
            />
            <AnimatedGradientText>🐧 | Proudly Open Source </AnimatedGradientText>
            <motion.div variants={itemVariants}>
              <BlurIn
                word={<>Padhle DSA kahin se, selection hogi yahi se.</>}
                className="font-display text-center text-4xl font-bold w-full lg:w-auto max-w-4xl mx-auto -z-10"
                duration={1}
              />
            </motion.div>
            <motion.h2
              className="text-xl text-opacity-60 tracking-normal text-center max-w-2xl mx-auto z-10"
              variants={itemVariants}
            >
              Suffer from <NumberTicker value={8000} />+ company-wise DSA questions like a true
              Codejeet. Kyunki naukri ke liye sab kuch chalega!
            </motion.h2>
            <motion.div variants={itemVariants} className="z-20">
              <Link href="/dashboard">
                <Button size="lg" className={cn("shadow-2xl text-lg px-8 py-3")}>
                  Get Started
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants} style={{ scale }} className="-mt-16">
              <AnimatedImage
                src="/image.png"
                alt="Image"
                width={2000}
                height={1500}
                className="w-full h-auto max-w-[90vw] mx-auto rounded-2xl shadow-lg px-0 sm:px-4"
              />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
