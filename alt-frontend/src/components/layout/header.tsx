import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                AI Outreach
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">
              Insurance Company Personalized Outreach System
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
