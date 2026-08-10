import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Logo } from './Logo';
import { useContract } from '../context/ContractContext';
import { PostJobModal } from './PostJobModal';
import { AdminModal } from './AdminModal';
import { Shield, Plus } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { stakeRefundEnabled } = useContract();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#fff8f4]/80 backdrop-blur-md border-b border-[#877366]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo size={32} />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-headline font-semibold text-sm tracking-wide">
            <Link
              to="/jobs"
              className={`transition-colors pb-1 ${
                isActive('/jobs')
                  ? 'text-[#914c00] border-b-2 border-[#914c00]'
                  : 'text-[#544438] hover:text-[#914c00]'
              }`}
            >
              Jobs
            </Link>
            <Link
              to="/dashboard"
              className={`transition-colors pb-1 ${
                isActive('/dashboard')
                  ? 'text-[#914c00] border-b-2 border-[#914c00]'
                  : 'text-[#544438] hover:text-[#914c00]'
              }`}
            >
              My Activity
            </Link>
            <Link
              to="/about"
              className={`transition-colors pb-1 ${
                isActive('/about')
                  ? 'text-[#914c00] border-b-2 border-[#914c00]'
                  : 'text-[#544438] hover:text-[#914c00]'
              }`}
            >
              About
            </Link>
            <Link
              to="/faq"
              className={`transition-colors pb-1 ${
                isActive('/faq')
                  ? 'text-[#914c00] border-b-2 border-[#914c00]'
                  : 'text-[#544438] hover:text-[#914c00]'
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* Actions & Connect Wallet */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#d47e30] hover:bg-[#b86111] text-white px-4 py-2 rounded-lg font-headline font-semibold text-xs tracking-wider uppercase hover-lift transition-all"
            >
              <Plus className="w-4 h-4" />
              Post Job
            </button>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              title="Global Policy Admin"
              className={`p-2 rounded-lg border transition-colors ${
                stakeRefundEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-amber-50 border-amber-300 text-amber-700'
              }`}
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* RainbowKit Wallet Connect Custom Trigger */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="bg-[#d47e30] hover:bg-[#b86111] text-white px-5 py-2.5 rounded-lg font-headline font-semibold text-sm hover-lift transition-all shadow-sm"
                          >
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="bg-red-600 text-white px-4 py-2 rounded-lg font-headline font-semibold text-xs hover-lift"
                          >
                            Wrong network (Switch to Arc)
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="bg-[#ffead8] border border-[#d47e30]/30 text-[#472200] px-4 py-2 rounded-lg font-headline font-semibold text-xs hover-lift transition-all"
                          >
                            {account.displayName}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </header>

      {/* Modals */}
      <PostJobModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </>
  );
};
