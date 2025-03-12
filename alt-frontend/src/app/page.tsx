import React from 'react';
import Link from 'next/link';
import { Card, CardBody } from '../components/ui/card';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI-Driven Outreach for Insurance Companies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with prospects through personalized communications tailored to their industry, 
            engagement level, and potential objections.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 mr-4">
              Get Started
            </Link>
            <Link href="/prospects" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-50">
              View Prospects
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="transform transition-transform hover:scale-105">
            <CardBody>
              <h2 className="text-xl font-semibold mb-2">Industry-Specific Targeting</h2>
              <p className="text-gray-600">
                Automatically customize outreach based on prospect's industry, addressing their unique needs and concerns.
              </p>
            </CardBody>
          </Card>
          
          <Card className="transform transition-transform hover:scale-105">
            <CardBody>
              <h2 className="text-xl font-semibold mb-2">Engagement Tracking</h2>
              <p className="text-gray-600">
                Track opens, clicks, and replies to measure effectiveness and adjust your approach accordingly.
              </p>
            </CardBody>
          </Card>
          
          <Card className="transform transition-transform hover:scale-105">
            <CardBody>
              <h2 className="text-xl font-semibold mb-2">Cold Call Scripts</h2>
              <p className="text-gray-600">
                Generate personalized call scripts tailored to each prospect's profile and previous interactions.
              </p>
            </CardBody>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to supercharge your outreach?</h2>
          <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700">
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}
