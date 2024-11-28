"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import BlurIn from "@/components/magic-ui/blur-in";
import AnimatedImage from "@/components/AnimatedImage";
import Link from "next/link";
import { TweetGrid } from "@/components/ui/tweet-grid";
import { DotPattern } from "@/components/magic-ui/dot-pattern";
import { cn } from "@/lib/utils";
import SparkleText from "@/components/magic-ui/sparkles-text";
import NumberTicker from "@/components/magic-ui/number-ticker";
import { RainbowButton } from "@/components/magic-ui/rainbow-button";
import AnimatedGradientText from "@/components/magic-ui/animated-gradient-text";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const exampleTweets = [
  "1861510338404921559",
  "1861987857000169750",
  "1861400396104892872",
  "1861397853446242485",
  "1861322291566780487",
  "1861507058027372906",
  "1861322976513139079",
  "1861330077453295859",
  "1861417007289086141",
];

export default function Home() {
  const testimonialsRef = useRef(null);
  const isInView = useInView(testimonialsRef, { once: true, margin: "-100px" });

  return (
    <div>
      <main>
        <div className="z-0 relative min-h-screen w-full pb-40 overflow-hidden ">
          <motion.div
            className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-6 px-4 pt-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <DotPattern
              className={cn(
                "absolute inset-0 z-0 [mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]"
              )}
            />
            <AnimatedGradientText>🎉 | Beta is Out </AnimatedGradientText>
            <motion.div variants={itemVariants}>
              <BlurIn
                word={
                  <>
                    Padhlo <SparkleText className="inline" text="DSA" /> kahin
                    se, selection hoga yahi se.
                  </>
                }
                className="font-display text-center text-4xl font-bold w-full lg:w-auto max-w-4xl mx-auto -z-10"
                duration={1}
              />
            </motion.div>
            <motion.h2
              className="text-xl text-opacity-60 tracking-normal text-center max-w-2xl mx-auto z-10"
              variants={itemVariants}
            >
              {" "}
              Struggle through <NumberTicker value={8000} />+ company-wise
              LeetCode questions like a true Codejeet. Kyunki naukri ke liye sab
              kuch chalega!
            </motion.h2>
            <motion.div variants={itemVariants} className="z-20">
              <Link href="/dashboard">
                <RainbowButton className={cn("shadow-2xl mb-10")}>
                  Get Started
                </RainbowButton>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <AnimatedImage
                src="/image.webp"
                alt="Image"
                width={1200}
                height={900}
                className="w-full h-auto max-w-6xl mx-auto rounded-2xl shadow-lg"
              />
            </motion.div>
          </motion.div>
          <motion.div
            ref={testimonialsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-7xl mx-auto px-4 py-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold mb-12"
            >
              <p className="text-center text-5xl pt-16 md:mp-32 pb-8">
                Kuch To लोग Kahenge 🤭
              </p>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <TweetGrid columns={3} tweets={exampleTweets} />
            </motion.div>
          </motion.div>{" "}
        </div>
      </main>
    </div>
  );
}
