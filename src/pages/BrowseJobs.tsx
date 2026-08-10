import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useContract } from '../context/ContractContext';
import { JobCard } from '../components/JobCard';

export const BrowseJobs: React.FC = () => {
  const { jobs } = useContract();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('open');
  const [tokenFilter, setTokenFilter] = useState<'all' | 'ARC' | 'USDC' | 'EURC'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'stake-high' | 'stake-low'>('newest');

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((j) => {
        // Status filter
        if (statusFilter === 'open' && !j.isOpen) return false;
        if (statusFilter === 'closed' && j.isOpen) return false;

        // Token filter
        if (tokenFilter !== 'all' && j.tokenSymbol !== tokenFilter) return false;

        // Search search
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = j.title.toLowerCase().includes(q);
          const matchDesc = j.description.toLowerCase().includes(q);
          const matchPoster = j.poster.toLowerCase().includes(q);
          return matchTitle || matchDesc || matchPoster;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'stake-high') return Number(b.applicationStake - a.applicationStake);
        if (sortBy === 'stake-low') return Number(a.applicationStake - b.applicationStake);
        return b.createdAt - a.createdAt; // newest
      });
  }, [jobs, searchTerm, statusFilter, tokenFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Search & Hero Header */}
      <section className="space-y-8">
        <h1 className="font-headline font-bold text-4xl sm:text-5xl text-[#2b1700]">
          Discover Opportunities
        </h1>

        {/* Search & Filter Bar (Matching Image 7) */}
        <div className="bg-white border border-[#877366]/20 rounded-full p-2.5 flex flex-col md:flex-row items-center gap-3 shadow-sm max-w-4xl">
          <div className="flex-grow flex items-center w-full pl-4">
            <Search className="w-5 h-5 text-[#877366] shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role, keyword, or company..."
              className="w-full bg-transparent border-none focus:outline-none text-base font-body placeholder-[#dac2b2] px-3 py-1.5 text-[#2b1700]"
            />
          </div>

          <div className="h-8 w-px bg-[#877366]/20 hidden md:block" />

          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto px-2 pb-2 md:pb-0">
            <button
              onClick={() => setStatusFilter('open')}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full font-headline font-semibold text-xs transition-colors ${
                statusFilter === 'open'
                  ? 'border border-[#914c00] bg-[#914c00]/10 text-[#914c00]'
                  : 'border border-[#877366]/20 text-[#544438] hover:border-[#877366]/40'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setStatusFilter('closed')}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full font-headline font-semibold text-xs transition-colors ${
                statusFilter === 'closed'
                  ? 'border border-[#914c00] bg-[#914c00]/10 text-[#914c00]'
                  : 'border border-[#877366]/20 text-[#544438] hover:border-[#877366]/40'
              }`}
            >
              Closed
            </button>

            <div className="w-px h-4 bg-[#877366]/20 mx-1 shrink-0" />

            <button
              onClick={() => setTokenFilter(tokenFilter === 'ARC' ? 'all' : 'ARC')}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-headline font-semibold text-xs transition-colors ${
                tokenFilter === 'ARC'
                  ? 'border border-[#914c00] bg-[#914c00]/10 text-[#914c00]'
                  : 'border border-[#877366]/20 text-[#544438] hover:border-[#877366]/40'
              }`}
            >
              ARC
            </button>
            <button
              onClick={() => setTokenFilter(tokenFilter === 'USDC' ? 'all' : 'USDC')}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-headline font-semibold text-xs transition-colors ${
                tokenFilter === 'USDC'
                  ? 'border border-[#914c00] bg-[#914c00]/10 text-[#914c00]'
                  : 'border border-[#877366]/20 text-[#544438] hover:border-[#877366]/40'
              }`}
            >
              USDC
            </button>
          </div>

          <button
            onClick={() => {}}
            className="w-full md:w-auto bg-[#914c00] hover:bg-[#b86111] text-white rounded-full px-8 py-3 font-headline font-semibold text-sm hover-lift transition-all shadow-sm"
          >
            Search
          </button>
        </div>
      </section>

      {/* Grid Meta & Content */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="font-body text-sm text-[#544438]">
            Showing <span className="font-semibold text-[#2b1700]">{filteredJobs.length}</span>{' '}
            {statusFilter === 'open' ? 'open' : statusFilter === 'closed' ? 'closed' : ''} positions
          </p>

          <div className="flex items-center gap-2 cursor-pointer text-[#914c00] font-headline font-semibold text-sm">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-headline font-bold text-sm focus:outline-none cursor-pointer border-none"
            >
              <option value="newest">Newest</option>
              <option value="stake-high">Highest Stake</option>
              <option value="stake-low">Lowest Stake</option>
            </select>
          </div>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, idx) => (
              <JobCard key={job.id.toString()} job={job} index={idx} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#877366]/15 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
            <h3 className="font-headline font-bold text-xl text-[#2b1700]">No Jobs Found</h3>
            <p className="font-body text-sm text-[#544438]">
              Try adjusting your search keywords or clearing status filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('open');
                setTokenFilter('all');
              }}
              className="px-5 py-2 rounded-lg bg-[#ffead8] text-[#914c00] font-headline font-semibold text-xs hover-lift"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
