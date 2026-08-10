import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useContract } from '../context/ContractContext';
import { TOKENS } from '../config/contract';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose }) => {
  const { postJob, isPendingTx } = useContract();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState<'ARC' | 'USDC' | 'EURC'>('ARC');
  const [stakeAmount, setStakeAmount] = useState('50');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !stakeAmount) return;

    setStatusMsg(null);
    const result = await postJob(title, description, tokenSymbol, stakeAmount);
    if (result.success) {
      setStatusMsg({ type: 'success', text: 'Job posted successfully on Arc Testnet!' });
      setTimeout(() => {
        onClose();
        setTitle('');
        setDescription('');
        setStatusMsg(null);
      }, 1200);
    } else {
      setStatusMsg({ type: 'error', text: result.error || 'Failed to post job' });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#FDFBD4] border border-[#877366]/20 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-xl relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#877366] hover:text-[#2b1700] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="font-headline font-bold text-2xl text-[#2b1700] mb-2">
            Post a New Job
          </h2>
          <p className="font-body text-xs text-[#544438] mb-6">
            Set your own required application stake amount to filter out spam applications.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-headline font-semibold text-xs text-[#544438] mb-1.5 uppercase tracking-wider">
                Job Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Smart Contract Engineer"
                className="w-full bg-white border border-[#877366]/20 rounded-lg px-4 py-2.5 font-body text-sm outline-none focus:border-[#914c00]"
              />
            </div>

            <div>
              <label className="block font-headline font-semibold text-xs text-[#544438] mb-1.5 uppercase tracking-wider">
                Description & Requirements
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail role responsibilities, qualifications, and expectations..."
                className="w-full bg-white border border-[#877366]/20 rounded-lg px-4 py-2.5 font-body text-sm outline-none focus:border-[#914c00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-headline font-semibold text-xs text-[#544438] mb-1.5 uppercase tracking-wider">
                  Stake Token
                </label>
                <select
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value as any)}
                  className="w-full bg-white border border-[#877366]/20 rounded-lg px-3 py-2.5 font-body text-sm outline-none focus:border-[#914c00]"
                >
                  <option value="ARC">ARC (Native)</option>
                  <option value="USDC">USDC (6 decimals)</option>
                  <option value="EURC">EURC (6 decimals)</option>
                </select>
              </div>

              <div>
                <label className="block font-headline font-semibold text-xs text-[#544438] mb-1.5 uppercase tracking-wider">
                  Stake Amount
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full bg-white border border-[#877366]/20 rounded-lg px-4 py-2.5 font-body text-sm outline-none focus:border-[#914c00]"
                />
              </div>
            </div>

            <p className="font-body text-[11px] text-[#877366] bg-[#ffead8]/60 p-3 rounded-lg border border-[#d47e30]/20">
              Contract Policy: Staked amounts are deposited to the contract when applicants apply.
            </p>

            {statusMsg && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-[#877366]/30 font-headline font-semibold text-xs text-[#544438] hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPendingTx}
                className="px-6 py-2.5 rounded-lg bg-[#d47e30] hover:bg-[#b86111] text-white font-headline font-semibold text-xs hover-lift transition-all inline-flex items-center gap-2"
              >
                {isPendingTx ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Job'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
