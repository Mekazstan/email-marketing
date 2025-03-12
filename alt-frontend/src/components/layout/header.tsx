import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                AI Outreach
              </Link>
            </div>
            <nav className="ml-10 flex items-center space-x-4">
              <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Dashboard
              </Link>
              <Link href="/prospects" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Prospects
              </Link>
              <Link href="/emails" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Emails
              </Link>
              <Link href="/calls" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Calls
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <button className="bg-blue-600 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700">
              Help
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
