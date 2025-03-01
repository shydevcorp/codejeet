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

const exampleTweets = [
  "1861987857000169750",
  "1861400396104892872",
  "1862122993960526278",
  "1861397853446242485",
  "1861322291566780487",
  "1863872908596224255",
  "1861330077453295859",
  "1861322460978983416",
  "1861417007289086141",
];

export default function Home() {
  const testimonialsRef = useRef(null);
  const isInView = useInView(testimonialsRef, { once: true, margin: "-100px" });

  return (
    <div className={outfit.className}>
      <main>
        <div className="z-0 relative min-h-screen w-full pb-40 overflow-hidden ">
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
                word={
                  <>
                    Padhlo <SparkleText className="inline" text="DSA" /> kahin se, practice hogi
                    yahi se.
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
              Suffer from <NumberTicker value={8000} />+ company-wise LeetCode questions like a true
              Codejeet. Kyunki naukri ke liye sab kuch chalega!
            </motion.h2>
            <motion.div variants={itemVariants} className="z-20">
              <Link href="/dashboard">
                <RainbowButton className={cn("shadow-2xl mb-4")}>Get Started</RainbowButton>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <AnimatedImage
                src="/image.webp"
                alt="Image"
                width={1200}
                height={900}
                className="w-full h-auto max-w-6xl mx-auto rounded-2xl shadow-lg px-0 sm:px-4"
              />
            </motion.div>
          </motion.div>

          {/* Testimonials section */}
          <motion.div
            ref={testimonialsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-7xl mx-auto px-4 pt-32 pb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold mb-16"
            >
              <p className="text-center text-5xl">Kuch To लोग Kahenge 🤭</p>
            </motion.h2>

            <div className="max-w-6xl mx-auto space-y-8">
              {/* Tweets */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <TweetGrid
                  columns={3}
                  tweets={exampleTweets}
                  spacing="lg"
                  className="!max-w-none !px-0"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
