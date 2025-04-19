import { BrainIcon } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background/80 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <div className="p-2 bg-primary/10 rounded">
              <BrainIcon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold font-mono">
              Fit
              <span className="text-primary">Genix</span>
              .ai
            </span>
          </div>

          {/* Links Section */}
          <div className="flex gap-6">
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link href="/help" className="hover:text-primary transition-colors">
              Help
            </Link>
          </div>

          {/* Status Section */}
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium">SYSTEM OPERATIONAL</span>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FitGenix.ai - All rights reserved
        </div>
      </div>
    </footer>
  );
};
export default Footer;
