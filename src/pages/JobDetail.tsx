import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet,
  ExternalLink,
  Check,
  User,
  AlertCircle,
  Loader2,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { useContract } from '../context/ContractContext';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    jobs,
    applications,
    applyToJob,
    closeJob,
    shortlistApplicant,
    checkNeedsApproval,
    approveToken,
    userAddress,
    isPendingTx,
  } = useContract();

  const [profileLink, setProfileLink] = useState('');
  const [needsApproval, setNeedsApproval] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const jobId = id ? BigInt(id) : BigInt(1);
  const job = jobs.find((j) => j.id === jobId) || jobs[0];

  const jobApps = applications.filter((a) => a.jobId === job.id);
  const isPoster =
    userAddress && job
      ? job.poster.toLowerCase() === userAddress.toLowerCase()
      : false;

  const hasAlreadyApplied = userAddress
    ? applications.some(
        (a) =>
          a.jobId === job.id &&
          a.applicant.toLowerCase() === userAddress.toLowerCase() &&
          !a.isWithdrawn
      )
    : false;

  // Check ERC20 token approval
  useEffect(() => {
    if (job) {
      checkNeedsApproval(job.id).then((res) => {
        setNeedsApproval(res.needsApproval);
      });
    }
  }, [job, userAddress]);

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="font-headline font-bold text-2xl">Job Not Found</h2>
        <Link to="/jobs" className="text-[#914c00] underline font-semibold">
          Back to Browse Jobs
        </Link>
      </div>
    );
  }

  const shortPoster = `${job.poster.slice(0, 6)}...${job.poster.slice(-4)}`;

  const handleApprove = async () => {
    setStatusMsg({ type: 'info', text: `Approving ${job.tokenSymbol} for Rhinestoone contract...` });
    const res = await approveToken(job.id);
    if (res.success) {
      setNeedsApproval(false);
      setStatusMsg({ type: 'success', text: `${job.tokenSymbol} approved! You can now click Apply.` });
    } else {
      setStatusMsg({ type: 'error', text: res.error || 'Approval failed' });
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileLink.trim()) return;

    if (needsApproval) {
      await handleApprove();
      return;
    }

    setStatusMsg({ type: 'info', text: 'Submitting application & staking tokens on Arc Testnet...' });
    const res = await applyToJob(job.id, profileLink);
    if (res.success) {
      setStatusMsg({ type: 'success', text: 'Application submitted & stake deposited successfully!' });
      setProfileLink('');
    } else {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to submit application' });
    }
  };

  const handleCloseJob = async () => {
    if (window.confirm('Are you sure you want to close this job listing?')) {
      const res = await closeJob(job.id);
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Job closed successfully.' });
      } else {
        setStatusMsg({ type: 'error', text: res.error || 'Failed to close job' });
      }
    }
  };

  const handleShortlist = async (appId: bigint) => {
    const res = await shortlistApplicant(appId);
    if (!res.success) {
      alert(res.error || 'Failed to shortlist applicant');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 font-headline font-semibold text-xs text-[#855325] hover:text-[#914c00] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      {/* Header Section (Matching Image 9) */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <h1 className="font-headline font-bold text-3xl sm:text-5xl text-[#2b1700]">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-[#877366] font-body text-sm">
              <User className="w-4 h-4" />
              <span>{shortPoster}</span>
            </div>

            {job.isOpen ? (
              <span className="bg-[#FDFBD4] border border-[#825E34]/20 text-[#8D5A2B] font-headline font-semibold text-xs px-3 py-1 rounded-sm">
                Open
              </span>
            ) : (
              <span className="bg-stone-200 text-stone-700 font-headline font-semibold text-xs px-3 py-1 rounded-sm inline-flex items-center gap-1">
                <Lock className="w-3 h-3" /> Closed
              </span>
            )}
          </div>
        </div>

        {/* Poster View Action */}
        {isPoster && job.isOpen && (
          <button
            onClick={handleCloseJob}
            disabled={isPendingTx}
            className="border-[1.5px] border-[#8D5A2B] text-[#8D5A2B] hover:bg-[#8D5A2B]/10 font-headline font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
          >
            Close Job
          </button>
        )}
      </section>

      {/* Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Description */}
        <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-[#825E34]/15 shadow-sm space-y-6">
          <div className="prose max-w-none space-y-4">
            <h2 className="font-headline font-bold text-2xl text-[#2b1700]">
              About the Role
            </h2>
            <p className="font-body text-base text-[#544438] leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
        </div>

        {/* Right Column: Sidebar & Actions */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          {/* Stake Requirement Box (Matching Image 9) */}
          <div className="bg-[#fff1e6] border border-[#d47e30] p-6 rounded-2xl text-center shadow-[4px_4px_0px_0px_#D47E30] space-y-2">
            <Wallet className="w-10 h-10 text-[#d47e30] mx-auto mb-1" />
            <h3 className="font-headline font-bold text-xl text-[#2b1700]">
              Stake Requirement
            </h3>
            <p className="font-headline font-bold text-3xl text-[#d47e30]">
              {job.formattedStake}
            </p>
            <p className="font-body text-xs text-[#544438] pt-1">
              Required to apply for this position. Stake is returned upon application review.
            </p>
          </div>

          {/* Applicant View: Apply Card */}
          <div className="bg-white border border-[#825E34]/15 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-headline font-bold text-xl text-[#2b1700]">
              Apply Now
            </h3>

            {!job.isOpen ? (
              <div className="p-4 bg-stone-100 rounded-xl text-stone-600 font-body text-xs text-center">
                This job listing is closed and no longer accepting applications.
              </div>
            ) : isPoster ? (
              <div className="p-4 bg-[#ffead8] rounded-xl text-[#472200] font-body text-xs text-center">
                You are the poster of this job listing.
              </div>
            ) : hasAlreadyApplied ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-body text-xs text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>You have already submitted an application for this job.</span>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label
                    htmlFor="portfolio"
                    className="block font-headline font-semibold text-xs text-[#544438] mb-2 uppercase tracking-wider"
                  >
                    Profile / Portfolio Link
                  </label>
                  <input
                    id="portfolio"
                    type="url"
                    required
                    value={profileLink}
                    onChange={(e) => setProfileLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-transparent border-b border-[#dac2b2] focus:border-[#914c00] px-0 py-2 outline-none font-body text-sm transition-colors text-[#2b1700]"
                  />
                </div>

                {statusMsg && (
                  <div
                    className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                      statusMsg.type === 'success'
                        ? 'bg-emerald-100 text-emerald-800'
                        : statusMsg.type === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-[#ffead8] text-[#472200]'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{statusMsg.text}</span>
                  </div>
                )}

                {needsApproval ? (
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isPendingTx}
                    className="w-full bg-[#855325] hover:bg-[#693c0f] text-white font-headline font-semibold text-sm py-3.5 rounded-xl hover-lift transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {isPendingTx ? <Loader2 className="w-4 h-4 animate-spin" /> : `1. Approve ${job.tokenSymbol}`}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isPendingTx}
                    className="w-full bg-[#d47e30] hover:bg-[#b86111] text-white font-headline font-semibold text-sm py-3.5 rounded-xl hover-lift transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {isPendingTx ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `Apply & Stake ${job.formattedStake}`
                    )}
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Poster View: Applications Management (Matching Image 9) */}
      <section className="space-y-6 pt-8 border-t border-[#877366]/20">
        <div className="flex justify-between items-center border-b border-[#877366]/15 pb-4">
          <h2 className="font-headline font-bold text-2xl text-[#2b1700]">
            Applications{' '}
            <span className="text-[#544438] text-sm font-normal">({jobApps.length} Applicants)</span>
          </h2>
          {isPoster && (
            <span className="bg-[#ffead8] text-[#914c00] font-headline font-semibold text-xs px-3 py-1 rounded-full">
              Poster Management Mode
            </span>
          )}
        </div>

        {jobApps.length > 0 ? (
          <div className="space-y-4">
            {jobApps.map((app) => (
              <div
                key={app.id.toString()}
                className="bg-white border border-[#825E34]/15 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover-lift"
              >
                <div className="space-y-1">
                  <a
                    href={app.profileLink.startsWith('http') ? app.profileLink : `https://${app.profileLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-headline font-semibold text-base text-[#d47e30] hover:underline inline-flex items-center gap-1.5"
                  >
                    {app.profileLink} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <div className="font-body text-xs text-[#544438]">
                    Applicant: <span className="font-mono text-[#2b1700]">{app.applicant}</span> • Staked {app.formattedStake}
                  </div>
                </div>

                <div>
                  {app.isShortlisted ? (
                    <div className="bg-[#8D5A2B] text-white font-headline font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 badge-pop whitespace-nowrap shadow-sm">
                      <Check className="w-4 h-4" /> Shortlisted
                    </div>
                  ) : isPoster ? (
                    <button
                      onClick={() => handleShortlist(app.id)}
                      disabled={isPendingTx}
                      className="border-[1.5px] border-[#8D5A2B] text-[#8D5A2B] hover:bg-[#8D5A2B]/10 font-headline font-semibold text-xs px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Shortlist
                    </button>
                  ) : (
                    <span className="bg-stone-100 text-stone-600 font-headline font-medium text-xs px-3 py-1.5 rounded-lg">
                      Under Review
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#877366]/15 rounded-2xl p-8 text-center text-[#544438] font-body text-sm">
            No applications submitted for this job position yet.
          </div>
        )}
      </section>
    </div>
  );
};
