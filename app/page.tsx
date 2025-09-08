"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import BlurIn from "@/components/magic-ui/blur-in";
import AnimatedImage from "@/components/AnimatedImage";
import Link from "next/link";
import Image from "next/image";
import { DotPattern } from "@/components/magic-ui/dot-pattern";
import { cn } from "@/lib/utils";
import NumberTicker from "@/components/magic-ui/number-ticker";
import { Button } from "@/components/ui/button";
import AnimatedGradientText from "@/components/magic-ui/animated-gradient-text";
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
  const [focusLabel, setFocusLabel] = useState<"DSA" | "System Design">("DSA");
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const handler = () => setIsDesktop(mq.matches);
    handler();
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    setFocusLabel(Math.random() < 0.5 ? "DSA" : "System Design");
  }, []);

  return (
    <div>
      <main>
        <div
          ref={containerRef}
          className="z-0 relative w-full bg-gradient-to-b from-background to-primary/10 pb-6 md:pb-40 md:min-h-screen overflow-hidden"
        >
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
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <AnimatedGradientText>Proudly Open Source </AnimatedGradientText>
              <span aria-hidden className="h-6 w-[2px] bg-foreground" />
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold leading-none text-foreground whitespace-nowrap">
                  Backed by
                </span>
                <Image
                  src="/cloudflare.png"
                  alt="Cloudflare"
                  width={168}
                  height={44}
                  className="h-9 w-auto translate-y-[1px]"
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <BlurIn
                word={
                  <>
                    <span className="md:whitespace-nowrap">Padhle {focusLabel} kahin se, </span>
                    <br className="hidden md:block" />
                    <span>selection hogi yahi se.</span>
                  </>
                }
                className="text-center text-5xl md:text-7xl font-bold break-words w-full max-w-[92vw] md:max-w-[1200px] px-2 mx-auto -z-10 leading-tight"
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
            <motion.div variants={itemVariants} className="z-20 flex gap-3">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className={cn(
                    "shadow-2xl h-12 px-8 text-lg leading-none transition hover:-translate-y-0.5 hover:brightness-110"
                  )}
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/system-design">
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(
                    "shadow-2xl h-12 px-8 text-lg leading-none transition hover:-translate-y-0.5 hover:brightness-110"
                  )}
                >
                  System Design
                </Button>
              </Link>
            </motion.div>
            <motion.div
              variants={itemVariants}
              style={{ scale: isDesktop ? (scale as any) : 1 }}
              className="-mt-16"
            >
              <AnimatedImage
                src={focusLabel === "DSA" ? "/image1.png" : "/image2.png"}
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
