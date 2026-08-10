import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Coins,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { useContract } from '../context/ContractContext';
import { PostJobModal } from '../components/PostJobModal';

export const Home: React.FC = () => {
  const { stats, stakeRefundEnabled } = useContract();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why do I need to stake to apply?',
      a: 'Staking a small deposit requires applicants to have real skin in the game. It completely eliminates mass automated spam and low-effort applications, ensuring job posters receive genuine, high-quality candidates.',
    },
    {
      q: 'Do I get my stake back?',
      a: 'Stake refunds are governed by a global platform refund policy managed by the admin. When `stakeRefundEnabled` is set to true on Arc Testnet, applicants can withdraw their stake from the My Applications dashboard. When set to false, stakes accumulate as platform fee revenue.',
    },
    {
      q: 'Can I apply to the same job twice?',
      a: 'No. The smart contract strictly enforces a single application per wallet address per job to maintain fairness and clean applicant records.',
    },
    {
      q: 'How do I know if I’ve been shortlisted?',
      a: 'Job posters can mark candidates as shortlisted on their applicant management view. You will see a "Shortlisted" status badge on your application card in the "My Applications" dashboard.',
    },
    {
      q: 'What currencies are used for staking?',
      a: 'Job posters choose the staking token when creating a listing. Supported tokens on Arc Testnet include native ARC, USDC (0x3600...), and EURC (0x89B5...).',
    },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffead8] border border-[#d47e30]/30 text-[#914c00] font-headline font-semibold text-xs tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#d47e30]" />
            Live on Arc Testnet
          </div>

          <h1 className="font-headline font-bold text-4xl sm:text-5xl lg:text-6xl text-[#2b1700] leading-[1.1] tracking-tight">
            Job Applications That Actually Mean Something
          </h1>

          <p className="font-body text-lg text-[#544438] max-w-xl leading-relaxed">
            Applicants stake a small deposit to apply, cutting down on spam and ensuring genuine hiring signals. No escrow involved—just high-quality connections.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="bg-[#d47e30] hover:bg-[#b86111] text-white px-8 py-3.5 rounded-xl font-headline font-semibold text-sm hover-lift shadow-sm transition-all"
            >
              Post a Job
            </button>
            <Link
              to="/jobs"
              className="bg-transparent border-[1.5px] border-[#855325] text-[#855325] hover:bg-[#855325]/10 px-8 py-3.5 rounded-xl font-headline font-semibold text-sm hover-lift transition-all inline-flex items-center gap-2"
            >
              Browse Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Hero Stack Illustration (Matching Image 5) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block relative"
        >
          <div className="relative w-full h-[420px] bg-white border border-[#877366]/15 rounded-2xl shadow-[0_20px_40px_-15px_rgba(74,55,40,0.1)] flex items-center justify-center p-8 overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#ffdcc3]/60 rounded-full blur-3xl pointer-events-none" />

            {/* Styled 3D Isometric Stack Graphic */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-[-24px] py-6">
              {/* Card 3 (Bottom) */}
              <div className="w-72 h-36 bg-stone-100 border border-stone-200 rounded-2xl shadow-sm transform rotate-[-6deg] translate-y-6 opacity-60 scale-90" />
              {/* Card 2 (Middle) */}
              <div className="w-72 h-36 bg-white border border-[#dac2b2] rounded-2xl shadow-md transform rotate-[3deg] translate-y-3 opacity-85 scale-95" />
              {/* Card 1 (Top) */}
              <div className="w-80 h-44 bg-white border-2 border-[#d47e30]/40 rounded-2xl shadow-xl p-6 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <span className="bg-[#ffead8] text-[#914c00] px-3 py-1 rounded-full font-headline font-semibold text-xs inline-flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#d47e30]" />
                    Job Application Submitted
                  </span>
                  <span className="font-headline font-bold text-xs text-[#d47e30]">
                    50 ARC Staked
                  </span>
                </div>

                <div className="space-y-1 my-2">
                  <div className="h-2.5 w-3/4 bg-stone-200 rounded-full" />
                  <div className="h-2.5 w-1/2 bg-stone-100 rounded-full" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-[11px] text-[#877366] font-mono">0x71C...3912</span>
                  <div className="w-6 h-6 rounded-full bg-[#d47e30] flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Live On-Chain Platform Stats Banner */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white border border-[#877366]/20 rounded-2xl p-8 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="font-headline font-bold text-3xl sm:text-4xl text-[#914c00] mb-1">
              {stats.totalJobs}
            </div>
            <div className="font-body text-xs sm:text-sm text-[#544438] font-medium flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#877366]" /> Total Jobs Posted
            </div>
          </div>

          <div>
            <div className="font-headline font-bold text-3xl sm:text-4xl text-[#914c00] mb-1">
              {stats.activeJobs}
            </div>
            <div className="font-body text-xs sm:text-sm text-[#544438] font-medium flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#877366]" /> Active Open Positions
            </div>
          </div>

          <div>
            <div className="font-headline font-bold text-3xl sm:text-4xl text-[#914c00] mb-1">
              {stats.totalApplications}
            </div>
            <div className="font-body text-xs sm:text-sm text-[#544438] font-medium flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#877366]" /> Staked Applications
            </div>
          </div>

          <div>
            <div className="font-headline font-bold text-2xl sm:text-3xl text-[#d47e30] mb-1">
              {stakeRefundEnabled ? 'Refundable' : 'Platform Fee'}
            </div>
            <div className="font-body text-xs sm:text-sm text-[#544438] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#877366]" /> Global Stake Policy
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & Spam Resistance Explainer */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-headline font-bold text-3xl sm:text-4xl text-[#2b1700] mb-4">
            How Rhinestone Works
          </h2>
          <p className="font-body text-sm sm:text-base text-[#544438]">
            An elegant decentralization loop designed to align incentives between job posters and candidates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#877366]/15 rounded-2xl p-8 space-y-4 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-[#ffead8] text-[#914c00] flex items-center justify-center font-headline font-bold text-xl">
              1
            </div>
            <h3 className="font-headline font-semibold text-xl text-[#2b1700]">
              Post & Set Staking Rules
            </h3>
            <p className="font-body text-sm text-[#544438] leading-relaxed">
              Any wallet can post a job listing and specify their desired application stake amount in ARC, USDC, or EURC.
            </p>
          </div>

          <div className="bg-white border border-[#877366]/15 rounded-2xl p-8 space-y-4 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-[#ffead8] text-[#914c00] flex items-center justify-center font-headline font-bold text-xl">
              2
            </div>
            <h3 className="font-headline font-semibold text-xl text-[#2b1700]">
              Stake to Apply
            </h3>
            <p className="font-body text-sm text-[#544438] leading-relaxed">
              Applicants deposit the exact required stake amount via smart contract when applying. This skin in the game filters out mass spam.
            </p>
          </div>

          <div className="bg-white border border-[#877366]/15 rounded-2xl p-8 space-y-4 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-[#ffead8] text-[#914c00] flex items-center justify-center font-headline font-bold text-xl">
              3
            </div>
            <h3 className="font-headline font-semibold text-xl text-[#2b1700]">
              Shortlist & Policy Refund
            </h3>
            <p className="font-body text-sm text-[#544438] leading-relaxed">
              Posters review candidate profile links and flag top candidates. Whether stakes are refundable or kept as platform revenue is a single global admin policy.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-headline font-semibold text-xs uppercase tracking-widest text-[#914c00]">
            Product Execution Plan
          </span>
          <h2 className="font-headline font-bold text-3xl sm:text-4xl text-[#2b1700] mt-2 mb-4">
            Rhinestone Roadmap
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border-2 border-[#d47e30] rounded-xl p-5 space-y-2 relative shadow-sm">
            <span className="inline-block px-2 py-0.5 rounded bg-[#ffead8] text-[#914c00] font-headline font-bold text-[10px] uppercase">
              Phase 1 — Current
            </span>
            <h4 className="font-headline font-bold text-base text-[#2b1700]">
              Testnet Launch
            </h4>
            <p className="font-body text-xs text-[#544438] leading-relaxed">
              Core contract deployed on Arc Testnet, poster-defined application stakes, shortlist flagging, and admin-controlled refund policy.
            </p>
          </div>

          <div className="bg-white border border-[#877366]/20 rounded-xl p-5 space-y-2">
            <span className="inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-headline font-semibold text-[10px] uppercase">
              Phase 2
            </span>
            <h4 className="font-headline font-bold text-base text-[#2b1700]">
              Richer Profiles
            </h4>
            <p className="font-body text-xs text-[#544438] leading-relaxed">
              On-chain applicant profile links with structured fields (skills, past work), poster ability to leave a short note when shortlisting.
            </p>
          </div>

          <div className="bg-white border border-[#877366]/20 rounded-xl p-5 space-y-2">
            <span className="inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-headline font-semibold text-[10px] uppercase">
              Phase 3
            </span>
            <h4 className="font-headline font-bold text-base text-[#2b1700]">
              Category & Search
            </h4>
            <p className="font-body text-xs text-[#544438] leading-relaxed">
              Job categories/tags, improved search and filtering as volume grows across engineering, research, and community.
            </p>
          </div>

          <div className="bg-white border border-[#877366]/20 rounded-xl p-5 space-y-2">
            <span className="inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-headline font-semibold text-[10px] uppercase">
              Phase 4
            </span>
            <h4 className="font-headline font-bold text-base text-[#2b1700]">
              Mainnet & Alerts
            </h4>
            <p className="font-body text-xs text-[#544438] leading-relaxed">
              Mainnet deployment, real-time push notification support for new applications and shortlist status changes.
            </p>
          </div>

          <div className="bg-white border border-[#877366]/20 rounded-xl p-5 space-y-2">
            <span className="inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-headline font-semibold text-[10px] uppercase">
              Phase 5
            </span>
            <h4 className="font-headline font-bold text-base text-[#2b1700]">
              Reputation Signals
            </h4>
            <p className="font-body text-xs text-[#544438] leading-relaxed">
              Optional visibility into an applicant's history across the platform to help posters evaluate candidates faster.
            </p>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 space-y-8">
        <div className="text-center">
          <h2 className="font-headline font-bold text-3xl sm:text-4xl text-[#2b1700] mb-3">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-sm text-[#544438]">
            Everything you need to know about staked job applications on Rhinestone.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#877366]/15 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-6 font-headline font-semibold text-lg text-[#2b1700] flex justify-between items-center gap-4 hover:bg-stone-50/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#877366] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#914c00]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 font-body text-sm text-[#544438] leading-relaxed border-t border-stone-100 mt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <PostJobModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
    </div>
  );
};
