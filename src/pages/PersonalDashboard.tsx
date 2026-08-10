import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import { useContract } from '../context/ContractContext';

export const PersonalDashboard: React.FC = () => {
  const {
    jobs,
    applications,
    stakeRefundEnabled,
    withdrawStake,
    userAddress,
    isPendingTx,
  } = useContract();

  const [activeTab, setActiveTab] = useState<'applications' | 'postings'>('applications');
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);

  // Filter user applications or show seed applications if wallet is disconnected
  const currentAddress = userAddress || '0x1230000000000000000000000000000000004567';

  const myApps = applications.filter(
    (a) => a.applicant.toLowerCase() === currentAddress.toLowerCase() || !userAddress
  );

  const myPostings = jobs.filter(
    (j) => j.poster.toLowerCase() === currentAddress.toLowerCase() || !userAddress
  );

  const handleWithdraw = async (appId: bigint) => {
    setWithdrawStatus(null);
    const res = await withdrawStake(appId);
    if (res.success) {
      setWithdrawStatus('Stake successfully withdrawn to your wallet on Arc Testnet!');
    } else {
      setWithdrawStatus(res.error || 'Failed to withdraw stake');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Header & Tabs (Matching Image 11) */}
      <div className="space-y-6">
        <h1 className="font-headline font-bold text-4xl sm:text-5xl text-[#2b1700]">
          Your Activity
        </h1>

        <div className="relative border-b border-[#dac2b2]/50 flex gap-8">
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-4 font-headline font-semibold text-base transition-colors relative ${
              activeTab === 'applications' ? 'text-[#914c00]' : 'text-[#544438] hover:text-[#914c00]'
            }`}
          >
            My Applications
            {activeTab === 'applications' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d47e30]"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('postings')}
            className={`pb-4 font-headline font-semibold text-base transition-colors relative ${
              activeTab === 'postings' ? 'text-[#914c00]' : 'text-[#544438] hover:text-[#914c00]'
            }`}
          >
            My Job Postings
            {activeTab === 'postings' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d47e30]"
              />
            )}
          </button>
        </div>
      </div>

      {withdrawStatus && (
        <div className="p-4 bg-[#ffead8] text-[#472200] border border-[#d47e30]/30 rounded-xl text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[#d47e30] shrink-0" />
          <span>{withdrawStatus}</span>
        </div>
      )}

      {/* My Applications View (Matching Image 11) */}
      {activeTab === 'applications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myApps.length > 0 ? (
            myApps.map((app, idx) => {
              const job = jobs.find((j) => j.id === app.jobId);
              const jobTitle = app.jobTitle || job?.title || 'Smart Contract Role';

              return (
                <motion.div
                  key={app.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white border border-[#877366]/15 rounded-2xl p-6 hover-lift flex flex-col justify-between space-y-6 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-headline font-bold text-xl text-[#2b1700] leading-snug">
                        {jobTitle}
                      </h3>

                      {app.isShortlisted ? (
                        <span className="bg-[#855325]/10 text-[#855325] border border-[#855325]/20 px-2.5 py-1 rounded-md font-headline font-semibold text-xs shrink-0">
                          Shortlisted
                        </span>
                      ) : (
                        <span className="bg-[#ffddba]/60 text-[#544438] border border-[#877366]/20 px-2.5 py-1 rounded-md font-headline font-semibold text-xs shrink-0">
                          Pending
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-body text-xs text-[#544438] mb-1">Staked Amount</p>
                      <p className="font-headline font-bold text-lg text-[#2b1700]">
                        {app.formattedStake}
                      </p>
                    </div>

                    <p className="font-body text-xs text-[#877366]">
                      {app.isWithdrawn
                        ? 'Stake successfully withdrawn'
                        : stakeRefundEnabled
                        ? 'Stake refundable per active platform policy'
                        : 'Stake non-refundable per platform policy'}
                    </p>
                  </div>

                  <div>
                    {app.isWithdrawn ? (
                      <button
                        disabled
                        className="w-full bg-stone-100 text-stone-500 rounded-xl py-2.5 font-headline font-semibold text-sm cursor-not-allowed border border-stone-200"
                      >
                        Withdrawn
                      </button>
                    ) : stakeRefundEnabled ? (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        disabled={isPendingTx}
                        className="w-full bg-[#d47e30] hover:bg-[#b86111] text-white rounded-xl py-2.5 font-headline font-semibold text-sm hover-lift transition-all inline-flex items-center justify-center gap-2"
                      >
                        {isPendingTx ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Withdraw Stake'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full border-1.5 border-[#855325] text-[#855325] rounded-xl py-2.5 font-headline font-semibold text-sm opacity-50 cursor-not-allowed"
                      >
                        Withdraw Stake
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full bg-white border border-[#877366]/15 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto">
              <h3 className="font-headline font-bold text-xl text-[#2b1700]">No Applications Yet</h3>
              <p className="font-body text-sm text-[#544438]">
                Browse open job listings and stake a small deposit to apply.
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d47e30] text-white font-headline font-semibold text-sm hover-lift"
              >
                Browse Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* My Job Postings View */}
      {activeTab === 'postings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPostings.length > 0 ? (
            myPostings.map((job, idx) => (
              <motion.div
                key={job.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white border border-[#877366]/15 rounded-2xl p-6 hover-lift flex flex-col justify-between space-y-6 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-headline font-bold text-xl text-[#2b1700] leading-snug">
                      {job.title}
                    </h3>
                    <span
                      className={`px-2.5 py-1 rounded-md font-headline font-semibold text-xs shrink-0 ${
                        job.isOpen
                          ? 'bg-[#ffead8] text-[#914c00] border border-[#d47e30]/30'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {job.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  <div>
                    <p className="font-body text-xs text-[#544438] mb-1">Applications</p>
                    <p className="font-headline font-bold text-lg text-[#2b1700]">
                      {job.applicantCount} Applications
                    </p>
                  </div>
                </div>

                <Link
                  to={`/job/${job.id}`}
                  className="w-full border-1.5 border-[#855325] text-[#855325] hover:bg-[#855325]/10 rounded-xl py-2.5 font-headline font-semibold text-sm transition-colors text-center inline-flex items-center justify-center gap-1.5"
                >
                  View Applications <ExternalLink className="w-4 h-4" />
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white border border-[#877366]/15 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto">
              <h3 className="font-headline font-bold text-xl text-[#2b1700]">No Job Postings Yet</h3>
              <p className="font-body text-sm text-[#544438]">
                Create your first job listing with custom staking requirements.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
