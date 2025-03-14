'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { useProspects } from '../../hooks/use-prospects';
import Link from 'next/link';

export default function DashboardPage() {
  const { prospects, loading, error } = useProspects();
  const [stats, setStats] = useState({
    totalProspects: 0,
    byIndustry: {} as Record<string, number>,
    withEmail: 0,
    withPhone: 0
  });

  useEffect(() => {
    if (!loading && !error && prospects.length > 0) {
      const byIndustry: Record<string, number> = {};
      let withEmail = 0;
      let withPhone = 0;

      prospects.forEach(prospect => {
        // Count by industry
        const industry = prospect.industry || 'Unknown';
        byIndustry[industry] = (byIndustry[industry] || 0) + 1;

        // Count contacts with email/phone
        if (prospect.email) withEmail++;
        if (prospect.phone) withPhone++;
      });

      setStats({
        totalProspects: prospects.length,
        byIndustry,
        withEmail,
        withPhone
      });
    }
  }, [prospects, loading, error]);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error loading data: {error.message}</div>;
  }

  // Sort industries by count (descending)
  const sortedIndustries = Object.entries(stats.byIndustry)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 industries

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.totalProspects}</div>
            <p className="text-gray-500 mt-2">Total Prospects</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.withEmail}</div>
            <p className="text-gray-500 mt-2">With Email ({Math.round((stats.withEmail / stats.totalProspects) * 100)}%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.withPhone}</div>
            <p className="text-gray-500 mt-2">With Phone ({Math.round((stats.withPhone / stats.totalProspects) * 100)}%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{Object.keys(stats.byIndustry).length}</div>
            <p className="text-gray-500 mt-2">Industries</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prospects by Industry</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedIndustries.length > 0 ? (
              <div className="space-y-4">
                {sortedIndustries.map(([industry, count]) => (
                  <div key={industry} className="flex justify-between items-center">
                    <span className="text-gray-700">{industry}</span>
                    <div className="flex items-center">
                      <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.round((count / stats.totalProspects) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-500">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No industry data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link href="/prospects/new">
                <div className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors flex items-center">
                  <div className="mr-3 bg-blue-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span>Add New Prospect</span>
                </div>
              </Link>

              <Link href="/prospects">
                <div className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors flex items-center">
                  <div className="mr-3 bg-green-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <span>Import Prospects</span>
                </div>
              </Link>

              <Link href="/emails">
                <div className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors flex items-center">
                  <div className="mr-3 bg-purple-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>Generate Personalized Email</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
