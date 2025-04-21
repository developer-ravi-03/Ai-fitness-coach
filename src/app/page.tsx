/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
"use client";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation } from "framer-motion";
import TerminalOverlay from "@/components/TerminalOverlay";
import UserPrograms from "@/components/UserPrograms";

// This function is used to animate the counting up of numbers
const countUp = (
  end: number,
  duration: number,
  callback: {
    (value: React.SetStateAction<number>): void;
    (value: React.SetStateAction<number>): void;
    (value: React.SetStateAction<number>): void;
    (arg0: number): void;
  }
) => {
  let start = 0;
  const range = end - start;
  let current = start;
  const increment = end / (duration * 60); // 60fps

  const step = () => {
    current += increment;
    if (current >= end) {
      current = end;
      callback(Math.floor(current));
    } else {
      callback(Math.floor(current));
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
};

const HomePage = () => {
  // Intersection Observer to trigger animations when the element is in view
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  const controls = useAnimation();
  const [users, setUsers] = useState(0);
  const [time, setTime] = useState(0);
  const [personalized, setPersonalized] = useState(0);

  //for the animation of the numbers when it is in view
  useEffect(() => {
    if (inView) {
      controls.start({ x: 0, opacity: 1, transition: { duration: 0.8 } });
      countUp(500, 1.5, setUsers);
      countUp(3, 1.5, setTime);
      countUp(100, 1.5, setPersonalized);
    }
  }, [inView]);

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 py-15 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            <div className="absolute -top-10 left-0 w-40 h-40 border-l-2 border-t-2" />

            <div className="lg:col-span-7 space-y-8 relative">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <div>
                  <span className="text-foreground">Transform</span>
                </div>
                <div>
                  <span className="text-primary">Your Body</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">With Advanced</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">AI</span>
                  <span className="text-primary"> Technology</span>
                </div>
              </h1>

              <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>

              <p className="text-xl text-muted-foreground w-2/3">
                Your AI fitness companion is here to craft custom routines and
                meal plans that align with your unique goals.
              </p>

              <motion.div
                ref={ref}
                initial={{ x: -100, opacity: 0 }}
                animate={controls}
                className="flex items-center gap-5 md:gap-12 py-6 font-mono"
              >
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">{users}+</div>
                  <div className="text-xs uppercase tracking-wider">
                    ACTIVE USERS
                  </div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">{time}min</div>
                  <div className="text-xs uppercase tracking-wider">
                    GENERATION
                  </div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">{personalized}%</div>
                  <div className="text-xs uppercase tracking-wider">
                    PERSONALIZED
                  </div>
                </div>
              </motion.div>

              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 pt-6"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    size="lg"
                    asChild
                    className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
                  >
                    <Link
                      href={"/generate-program"}
                      className="flex items-center font-mono"
                    >
                      Build Your Program
                      <ArrowRightIcon className="ml-2 size-5" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border" />
              </div>

              <div className="relative aspect-square max-w-lg mx-auto">
                <motion.div
                  className="relative overflow-hidden rounded-lg bg-cyber-black"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.3 }} // triggers when 30% is visible
                >
                  <motion.img
                    src="/hero-ai3.png"
                    alt="AI Fitness Coach"
                    className="size-full object-cover object-center"
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                  />

                  {/* Scanline Effect */}
                  <motion.div
                    className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  />

                  {/* Decorations */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-chart-4/40 rounded-full" />
                    <div className="absolute top-1/2 left-0 w-1/4 h-px bg-chart-4/40" />
                    <div className="absolute top-1/2 right-0 w-1/4 h-px bg-chart-4/40" />
                    <div className="absolute top-0 left-1/2 h-1/4 w-px bg-chart-4/40" />
                    <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-chart-4/40" />
                  </motion.div>

                  {/* Gradient overlay from bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </motion.div>

                {/* TERMINAL OVERLAY on image for good ui design */}
                <TerminalOverlay />
              </div>
            </div>
          </div>
        </div>
      </section>
      <UserPrograms />
    </div>
  );
};

export default HomePage;
