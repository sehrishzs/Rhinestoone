import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#462a05] text-[#fff8f4] py-12 mt-20 border-t border-[#877366]/20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Brand & Disclaimer */}
        <div className="flex flex-col gap-3">
          <div className="font-headline font-bold text-3xl text-[#ffdcc3] tracking-tight">
            Rhinestone
          </div>
          <p className="font-body text-sm text-[#ffddba]/80 leading-relaxed max-w-sm">
            High-quality connections through staked applications on Arc Testnet.
          </p>
          <p className="font-body text-xs text-[#ffddba]/50 mt-2">
            Rhinestone is an independent project built on Arc Testnet.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <h3 className="font-headline font-semibold text-sm text-[#ffdcc3] uppercase tracking-wider mb-1">
            Links
          </h3>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-[#ffddba]/80 hover:text-[#ffdcc3] transition-colors inline-flex items-center gap-1.5 w-fit"
          >
            GitHub <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-[#ffddba]/80 hover:text-[#ffdcc3] transition-colors inline-flex items-center gap-1.5 w-fit"
          >
            X (Twitter) <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href="https://testnet.arcscan.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-[#ffddba]/80 hover:text-[#ffdcc3] transition-colors inline-flex items-center gap-1.5 w-fit"
          >
            ArcScan Explorer <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

        {/* Network Badge & Creator Tag */}
        <div className="flex flex-col items-start md:items-end justify-between h-full gap-6">
          <div className="px-3.5 py-1.5 rounded-full border border-[#ffdcc3]/30 bg-[#ffdcc3]/10 text-[#ffdcc3] font-headline font-semibold text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ffb77e] animate-pulse"></span>
            Arc Testnet
          </div>

          <div className="mt-auto">
            <p className="font-headline font-semibold text-sm text-[#ffdcc3] glow-hover cursor-pointer py-1 px-2 rounded tracking-wide">
              Built by Sehrish
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
