'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/card';
import Button from '../../components/ui/button';
import { useProspects } from '../../hooks/use-prospects';

export default function DashboardPage() {
  const { prospects, loading, error } = useProspects();
  const [stats, setStats] = useState({
    totalProspects: 0,
    byIndustry: {},
    recentEmails: 0,
    recentCalls: 0,
    responseRate: 0,
  });

  useEffect(() => {
    if (!loading && prospects) {
      // Calculate statistics
      const industryCount = prospects.reduce((acc, prospect) => {
        const industry = prospect.industry;
        acc[industry] = (acc[industry] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalProspects: prospects.length,
        byIndustry: industryCount,
        recentEmails: Math.floor(Math.random() * prospects.length), // Mock data
        recentCalls: Math.floor(Math.random() * prospects.length / 2), // Mock data
        responseRate: Math.floor(Math.random() * 35) + 15, // Mock data: 15-50%
      });
    }
  }, [loading, prospects]);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your outreach activities and prospects</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/prospects" className="block">
          <Card className="h-full transform transition-transform hover:scale-105 hover:shadow-lg">
            <CardBody className="flex flex-col items-center justify-center text-center py-8">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Manage Prospects</h2>
              <p className="text-gray-600 mt-2">View, add, and edit your prospect list</p>
            </CardBody>
          </Card>
        </Link>

        <Link href="/emails" className="block">
          <Card className="h-full transform transition-transform hover:scale-105 hover:shadow-lg">
            <CardBody className="flex flex-col items-center justify-center text-center py-8">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Generate Emails</h2>
              <p className="text-gray-600 mt-2">Create and send personalized cold emails</p>
            </CardBody>
          </Card>
        </Link>

        <Link href="/calls" className="block">
          <Card className="h-full transform transition-transform hover:scale-105 hover:shadow-lg">
            <CardBody className="flex flex-col items-center justify-center text-center py-8">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Generate Call Scripts</h2>
              <p className="text-gray-600 mt-2">Create personalized cold call scripts</p>
            </CardBody>
          </Card>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Prospect Overview</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Prospects</span>
                <span className="font-semibold text-xl">{stats.totalProspects}</span>
              </div>
              <h3 className="font-medium text-lg mt-2 mb-1">By Industry</h3>
              <div className="space-y-2">
                {Object.entries(stats.byIndustry).map(([industry, count]) => (
                  <div key={industry} className="flex justify-between items-center">
                    <span className="text-gray-600">{industry}</span>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
          <CardFooter className="bg-gray-50">
            <Link href="/prospects">
              <Button variant="outline" size="sm" className="w-full">View All Prospects</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Engagement Summary</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recent Emails Sent</span>
                <span className="font-semibold text-xl">{stats.recentEmails}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recent Calls Made</span>
                <span className="font-semibold text-xl">{stats.recentCalls}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Response Rate</span>
                <span className="font-semibold text-xl">{stats.responseRate}%</span>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-lg mb-2">Recent Engagement</h3>
                <div className="bg-gray-100 rounded p-4 text-center text-gray-500">
                  Chart would go here in a real implementation
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter className="bg-gray-50">
            <Link href="/analytics">
              <Button variant="outline" size="sm" className="w-full">View Detailed Analytics</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {/* This would be populated with actual activity data in a real implementation */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start">
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center mr-3 ${
                    i % 3 === 0 ? 'bg-blue-100 text-blue-600' : 
                    i % 3 === 1 ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {i % 3 === 0 ? '📋' : i % 3 === 1 ? '📧' : '📞'}
                  </div>
                  <div>
                    <p className="font-medium">
                      {i % 3 === 0 ? 'New prospect added' : 
                       i % 3 === 1 ? 'Email sent to TechCorp Inc.' : 'Call made to HealthPlus'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(Date.now() - i * 3600000).toLocaleDateString()} | {new Date(Date.now() - i * 3600000).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
