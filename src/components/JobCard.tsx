import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Lock, CheckCircle2 } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  index?: number;
}

export const JobCard: React.FC<JobCardProps> = ({ job, index = 0 }) => {
  const shortPoster = `${job.poster.slice(0, 5)}...${job.poster.slice(-4)}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white border border-[#877366]/15 rounded-xl p-6 flex flex-col h-full hover-lift cursor-pointer group shadow-sm relative overflow-hidden"
    >
      <Link to={`/job/${job.id}`} className="flex flex-col h-full">
        {/* Card Header */}
        <div className="flex justify-between items-center mb-4">
          {job.isOpen ? (
            <span className="bg-[#914c00]/10 text-[#914c00] px-3 py-1 rounded-sm font-headline font-semibold text-xs inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#914c00] animate-pulse"></span>
              Open
            </span>
          ) : (
            <span className="bg-stone-200/80 text-stone-700 px-3 py-1 rounded-sm font-headline font-semibold text-xs inline-flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Closed
            </span>
          )}
          <span className="text-[#877366] text-xs font-mono">{shortPoster}</span>
        </div>

        {/* Title & Description */}
        <h3 className="font-headline font-semibold text-xl text-[#2b1700] mb-2 group-hover:text-[#914c00] transition-colors leading-snug">
          {job.title}
        </h3>
        <p className="font-body text-sm text-[#544438] mb-6 line-clamp-2 flex-grow leading-relaxed">
          {job.description.replace(/###?\s*/g, '')}
        </p>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#877366]/15 mt-auto flex justify-between items-end">
          <div>
            <span className="block font-headline font-semibold text-[11px] text-[#dac2b2] uppercase tracking-wider mb-1">
              Required Stake
            </span>
            <div className="font-headline font-bold text-xl text-[#914c00] flex items-baseline gap-1">
              {job.formattedStake}
            </div>
          </div>

          <div className="text-right">
            <div className="font-body text-xs text-[#544438] flex items-center gap-1 justify-end font-medium">
              {job.isOpen ? (
                <>
                  <Users className="w-3.5 h-3.5 text-[#877366]" />
                  <span>{job.applicantCount} Applicants</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Closed</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
