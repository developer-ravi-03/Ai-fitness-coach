"use client";
import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import {
  BrainIcon,
  DumbbellIcon,
  HomeIcon,
  UserIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-md border-b border-border py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1 bg-[#00F0FF]/10 rounded">
              <BrainIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold font-mono text-white">
              Fit<span className="text-primary">Genix</span>.ai
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {isSignedIn ? (
              <>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-sm hover:text-primary"
                >
                  <HomeIcon size={16} />
                  <span>Home</span>
                </Link>
                <Link
                  href="/generate-program"
                  className="flex items-center gap-1.5 text-sm hover:text-primary"
                >
                  <DumbbellIcon size={16} />
                  <span>Generate</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-sm hover:text-primary"
                >
                  <UserIcon size={16} />
                  <span>Profile</span>
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                >
                  <Link href="/generate-program">Get Started</Link>
                </Button>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton>
                  <Button
                    variant="outline"
                    className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )}
          </nav>

          {/* Mobile Right-Side: Hamburger OR Auth Buttons */}
          <div className="md:hidden flex items-center gap-3">
            {isSignedIn ? (
              <button onClick={() => setDrawerOpen(true)}>
                <MenuIcon className="text-white" size={26} />
              </button>
            ) : (
              <>
                <SignInButton>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Dark Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Right-Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-background z-50 shadow-lg transform transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 justify-center items-center text-center gap-6">
          {/* Close Button */}
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <XIcon size={24} />
          </button>

          {/* Navigation Items */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-primary"
            onClick={() => setDrawerOpen(false)}
          >
            <HomeIcon size={18} />
            Home
          </Link>

          <Link
            href="/generate-program"
            className="flex items-center gap-2 text-white hover:text-primary"
            onClick={() => setDrawerOpen(false)}
          >
            <DumbbellIcon size={18} />
            Generate
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-2 text-white hover:text-primary"
            onClick={() => setDrawerOpen(false)}
          >
            <UserIcon size={18} />
            Profile
          </Link>

          <Link
            href="/generate-program"
            className="mt-4 px-4 py-2 border border-primary text-primary rounded hover:bg-primary/10 transition"
            onClick={() => setDrawerOpen(false)}
          >
            Get Started
          </Link>

          <div className="mt-8">
            <UserButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
