import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract } from '../context/ContractContext';
import { ADMIN_WALLET_ADDRESS } from '../config/contract';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { stakeRefundEnabled, setStakeRefundPolicy, isPendingTx, userAddress } = useContract();
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAdmin = userAddress && userAddress.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();

  const handleToggle = async (newValue: boolean) => {
    setStatusMsg(null);
    const res = await setStakeRefundPolicy(newValue);
    if (res.success) {
      setStatusMsg(`Platform refund policy updated: ${newValue ? 'REFUNDABLE' : 'NON-REFUNDABLE (Platform Fee)'}`);
    } else {
      setStatusMsg(res.error || 'Failed to update policy');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#FDFBD4] border border-[#877366]/20 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#877366] hover:text-[#2b1700] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#d47e30]/15 text-[#914c00]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-xl text-[#2b1700]">
                Platform Policy Control
              </h2>
              <p className="font-body text-xs text-[#544438]">
                Global `stakeRefundEnabled` policy on Arc Testnet
              </p>
            </div>
          </div>

          {!isAdmin ? (
            <div className="bg-white border border-[#877366]/15 rounded-xl p-6 text-center space-y-4">
              <div className="space-y-1">
                <h3 className="font-headline font-bold text-base text-[#2b1700]">
                  Admin Wallet Required
                </h3>
                <p className="font-body text-xs text-[#544438] leading-relaxed">
                  Only the platform admin wallet (<span className="font-mono font-semibold text-[#914c00] text-[11px] break-all">{ADMIN_WALLET_ADDRESS}</span>) can toggle global stake refund policies.
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <ConnectButton />
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white border border-[#877366]/15 rounded-xl p-4 mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-headline font-semibold text-xs uppercase tracking-wider text-[#544438]">
                    Current Policy Status:
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded font-headline font-bold text-xs ${
                      stakeRefundEnabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {stakeRefundEnabled ? 'Refundable to Applicants' : 'Non-Refundable (Platform Fee)'}
                  </span>
                </div>

                <p className="font-body text-xs text-[#544438] leading-relaxed">
                  This single global policy dictates whether applicants can call <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">withdrawStake()</code> on "My Applications" page.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleToggle(true)}
                  disabled={isPendingTx || stakeRefundEnabled}
                  className={`w-full py-3 px-4 rounded-lg font-headline font-semibold text-xs flex items-center justify-between border transition-all ${
                    stakeRefundEnabled
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 cursor-default'
                      : 'border-[#877366]/30 bg-white text-[#2b1700] hover:bg-emerald-50/60'
                  }`}
                >
                  <span>Enable Refundable Stakes</span>
                  {stakeRefundEnabled ? <Check className="w-4 h-4 text-emerald-600" /> : null}
                </button>

                <button
                  onClick={() => handleToggle(false)}
                  disabled={isPendingTx || !stakeRefundEnabled}
                  className={`w-full py-3 px-4 rounded-lg font-headline font-semibold text-xs flex items-center justify-between border transition-all ${
                    !stakeRefundEnabled
                      ? 'border-amber-500 bg-amber-50 text-amber-900 cursor-default'
                      : 'border-[#877366]/30 bg-white text-[#2b1700] hover:bg-amber-50/60'
                  }`}
                >
                  <span>Disable Refundable Stakes (Keep as Platform Fee)</span>
                  {!stakeRefundEnabled ? <Check className="w-4 h-4 text-amber-600" /> : null}
                </button>
              </div>

              {statusMsg && (
                <div className="mt-4 p-3 bg-[#ffead8] text-[#472200] rounded-lg text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#d47e30]" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {isPendingTx && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#914c00]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating policy on Arc Testnet...</span>
                </div>
              )}
            </>
          )}

          <div className="mt-6 pt-4 border-t border-[#877366]/15 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#2b1700] text-white font-headline font-semibold text-xs hover-lift"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
