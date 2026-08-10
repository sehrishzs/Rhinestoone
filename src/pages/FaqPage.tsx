import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

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
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="font-headline font-bold text-4xl text-[#2b1700]">
          Frequently Asked Questions
        </h1>
        <p className="font-body text-base text-[#544438]">
          Answers to common questions regarding Rhinestoone staked job applications.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-[#877366]/15 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
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
    </div>
  );
};
