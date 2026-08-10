import React from 'react';
import { ShieldCheck, Zap, Coins, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4 text-center">
        <span className="font-headline font-semibold text-xs uppercase tracking-widest text-[#914c00]">
          Decentralized Recruitment Architecture
        </span>
        <h1 className="font-headline font-bold text-4xl sm:text-5xl text-[#2b1700]">
          About Rhinestoone
        </h1>
        <p className="font-body text-base text-[#544438] max-w-2xl mx-auto leading-relaxed">
          Rhinestoone solves the Web3 talent acquisition signal problem by requiring economic stakes for job applications on Arc Testnet.
        </p>
      </div>

      <div className="bg-white border border-[#877366]/20 rounded-2xl p-8 space-y-6 shadow-sm">
        <h2 className="font-headline font-bold text-2xl text-[#2b1700]">
          How Staked Applications Work
        </h2>

        <div className="space-y-4 font-body text-sm text-[#544438] leading-relaxed">
          <p>
            In traditional Web3 hiring, job posters are inundated with hundreds of auto-generated, low-quality bot applications. Applicants face no consequence for submitting non-tailored resumes.
          </p>
          <p>
            <strong>Rhinestoone flips this mechanic:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#2b1700]">
            <li>
              <strong>Poster Staking Rules:</strong> Any wallet can post a job and set a custom application stake amount in ARC, USDC, or EURC.
            </li>
            <li>
              <strong>Applicant Deposit:</strong> Applicants must deposit that stake to apply. This creates an immediate economic cost to mass-spamming.
            </li>
            <li>
              <strong>Shortlisting:</strong> Job posters can flag top candidate profiles on-chain.
            </li>
            <li>
              <strong>Global Refund Policy:</strong> Admin controls a single global <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">stakeRefundEnabled</code> switch. When enabled, applicants can reclaim their staked deposits. When disabled, stakes accumulate as platform revenue.
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#877366]/15 rounded-2xl p-6 space-y-3">
          <div className="p-3 bg-[#ffead8] text-[#914c00] rounded-xl w-fit">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-bold text-lg text-[#2b1700]">Arc Testnet Deployment</h3>
          <p className="font-body text-xs text-[#544438] leading-relaxed">
            Deployed on Arc Testnet (Chain ID: 5042002) with native ARC and ERC20 support for USDC and EURC.
          </p>
        </div>

        <div className="bg-white border border-[#877366]/15 rounded-2xl p-6 space-y-3">
          <div className="p-3 bg-[#ffead8] text-[#914c00] rounded-xl w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-bold text-lg text-[#2b1700]">Non-Custodial Architecture</h3>
          <p className="font-body text-xs text-[#544438] leading-relaxed">
            All stakes are held by the verified Rhinestoone smart contract on Arc Testnet with transparent execution logic.
          </p>
        </div>
      </div>
    </div>
  );
};
