'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { CategoryNomineesResponse } from '@/types/nominees';

async function getCategoryNominees(id: string): Promise<CategoryNomineesResponse> {
  const res = await fetch(`https://tcaapi.kaba.et/api/category-nominees/${id}`);
  if (!res.ok) throw new Error('Failed to fetch nominees');
  return res.json();
}

interface PageProps {
  params: Promise<{ id: string }>; // params is now a Promise
}

export default function CategoryNomineesPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [data, setData] = useState<CategoryNomineesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategoryNominees(id)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-[#0A0A0A]">
        Failed to load: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300 bg-[#0A0A0A]">
        Loading...
      </div>
    );
  }

  const { category, nominees } = data;
  const sortedNominees = [...nominees].sort(
    (a, b) => b.total_vote_count - a.total_vote_count
  );

  const handleVoteClick = () => {
    window.open(`https://www.tca2025.com/category/${id}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Categories
        </Link>

        {/* 🏆 Category Header */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <img
              src={category.image}
              alt={category.name}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0 border border-gray-700"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {category.name}
              </h1>
              <p className="text-gray-400 text-base mb-4">
                {category.description}
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Eligibility Criteria
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                  {category.criteria.map((criterion) => (
                    <li key={criterion.id}>{criterion.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 👥 Nominees Table */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-semibold text-white">
              Nominees ({sortedNominees.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#1C1C1C] border-b border-gray-700">
                <tr>
                  {['Rank', 'Nominee', 'Username', 'Followers', 'Votes', 'Action'].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {sortedNominees.map((nominee, index) => (
                  <tr
                    key={nominee.nominee_id}
                    className="hover:bg-[#1A1A1A] transition-colors duration-150"
                  >
                    {/* Rank */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          index === 0
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : index === 1
                            ? 'bg-gray-500/20 text-gray-300'
                            : index === 2
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </td>

                    {/* Nominee Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover mr-3 border border-gray-700"
                          src={nominee.image}
                          alt={nominee.name}
                        />
                        <div className="text-gray-100 font-medium">
                          {nominee.name}
                        </div>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="px-6 py-4 text-gray-400">
                      @{nominee.username}
                    </td>

                    {/* Followers */}
                    <td className="px-6 py-4 text-gray-400">
                      {nominee.number_of_followers.toLocaleString()}
                    </td>

                    {/* Votes */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        {nominee.total_vote_count.toLocaleString()} votes
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <button
                        onClick={handleVoteClick}
                        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        Vote Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
